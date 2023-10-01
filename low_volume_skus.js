/* This Script pulls all products associated with the account CID.
 * You can optionally add a MerchantId filter, as stated below.
 * Please modify the variable for spreadsheet link as instructed below
 * Some other variables may be modified by demand, following guideline in
 comments.
 * Currently this script outputs 2 columns, the product ID and the custom label.
 * IMPORTANT: An EMPTY label is required for this solution.
 * NOTE: A product should not be running in multiple campaigns.

 * COPY THIS SCRIPT INTO YOUR GOOGLE ADS SCRIPT.
 */


// Define which custom label nr [0-4] will be used.
// IMPORTANT: Ensure this label is free and only used for this solution.
// This number should match the custom_label nr in the second column of the
// spreadsheet above.
var CUSTOM_LABEL_NR = '4';

// Create a new Google spreadsheet.
// Replace the URL below with the newly created one (or replace the ID).
// Add these values to A1 and B1 respectively:
// A1 = 'id', B1 = 'custom_label4' - the nr of the custom label should match the
// above. Name this working sheet 'LowVolume'. Copy the link of the new sheet
// and paste it below.
var SPREADSHEET_URL =
    'https://docs.google.com/spreadsheets/d/SPREADSHEET_ID';

var SHEET_NAME = 'LowVolume';

// Set the value for the label for newly flagged low volume products.
var LABEL_LOW = 'low_clicks_last_30d';

// Set the value for the label for low volume products that have ramped up.
var LABEL_RAMPED_UP = 'product_ramped_up';

// Set the nr. of clicks with which should be considered ramped_up.
// It needs to be a string to be added as part of the query statement.
var THRESHOLD = '1';

// The following filter will detect low volume products, using the threshold
// above. You can add other metrics to filter on, for ex. adding AND
// metrics.impressions < 100. Optionally you can filter on a merchant, e.g.
// adding AND MerchantId = 1234.
var FILTER_NO_CLICKS = 'metrics.clicks < ' + THRESHOLD;

// The following filter will identify products that have already ramped up.
// As a condition, it must have the previously added label and for ex. clicks
// >50. To add further conditions use the AND clause, e.g. AND Conversions > 10.
var FILTER_RAMPED_UP = 'metrics.clicks > ' + THRESHOLD +
    ' AND segments.product_custom_attribute' + CUSTOM_LABEL_NR + ' LIKE "' +
    LABEL_LOW + '" ';

// To filter campaign names, add for ex. AND campaign.name LIKE “%FR_FR%”.
// Set the filter to true to include it.
var USE_CAMPAIGN_FILTER = false;
var FILTER_CAMPAIGN_NAME = ' AND campaign.name LIKE "%FR_FR_%" ';

// To filter a Merchant Center account, add "AND segments.product_merchant_id = 1234"
// Helpful when multiple Merchant Center accounts are under one Google Ads account
// Set the filter to true to include it.
var USE_MERCHANT_CENTER_ID_FILTER = false;
var FILTER_MERCHANT_CENTER_ID = ' AND segments.product_merchant_id = 123456789 ';

// Google Ads API returns product Id values in lower cases. If your product ID
// is capitalised please, set following flag to true.
var PRODUCT_ID_CAPITALISED = false;

// Enter time duration below. Possibilities:
// TODAY | YESTERDAY | LAST_7_DAYS | LAST_WEEK | LAST_BUSINESS_WEEK |
// THIS_MONTH | LAST_MONTH | LAST_14_DAYS | LAST_30_DAYS |
// THIS_WEEK_SUN_TODAY | THIS_WEEK_MON_TODAY | LAST_WEEK_SUN_SAT Currently
// default time duration is set to: LAST_30_DAYS
var TIME_DURATION = 'LAST_30_DAYS';

// This variable helps control data overflow in the target sheet.
// Increasing this value may cause timeouts and sheet errors.
// For ex. 10K products may take ~30 secs to run, 100K ~ 5 mins, while 500K
// could take 20+ mins.
var COUNT_LIMIT = '10000';


function main() {
  var productsNoClicks =
      getFilteredShoppingProducts(FILTER_NO_CLICKS, checkLabel = false);
  var productsRampedUp =
      getFilteredShoppingProducts(FILTER_RAMPED_UP, checkLabel = true);
  var products = productsNoClicks.concat(productsRampedUp);
  pushToSpreadsheet(products);
}

function getFilteredShoppingProducts(filters, checkLabel) {
  var campaignField = '';
  if (USE_CAMPAIGN_FILTER) {
    campaignField = 'campaign.name, ';
    filters = filters + FILTER_CAMPAIGN_NAME
  }
  var merchantIdField = '';
  if (USE_MERCHANT_CENTER_ID_FILTER) {
    merchantIdField = 'segments.product_merchant_id, ';
    filters = filters + FILTER_MERCHANT_CENTER_ID
  }
  var labelField = ''
  if (checkLabel) {
    label = 'segments.product_custom_attribute' + CUSTOM_LABEL_NR
    labelField = label + ', '
  };

  var query = 'SELECT segments.product_item_id, ' + campaignField + merchantIdField + labelField +
      'metrics.clicks, metrics.impressions ' +
      'FROM shopping_performance_view WHERE ' + filters +
      ' AND segments.product_item_id != "undefined"' +
      ' AND segments.date DURING ' + TIME_DURATION +
      ' ORDER BY segments.product_item_id LIMIT ' + COUNT_LIMIT;

  var products = [];
  var count = 0;
  var report = AdsApp.report(query);
  var rows = report.rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var clicks = row['metrics.clicks'];
    var productId = (PRODUCT_ID_CAPITALISED) ?
        row['segments.product_item_id'].toUpperCase() :
        row['segments.product_item_id'];

    // Label product as low volume, if below threshold defined above.
    if (clicks < THRESHOLD) {
      products.push([productId, LABEL_LOW]);
      count += 1;

      // Label product as ramped up, if it surpasses expected threshold.
    } else {
      products.push([productId, LABEL_RAMPED_UP]);
      count += 1;
    }
  }
  Logger.log(count);
  return products;
}


function pushToSpreadsheet(data) {
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheetByName('SHEET_NAME');

  var lastRow = sheet.getMaxRows();
  sheet.getRange('A2:B' + lastRow).clearContent();

  var start_row = 2;
  var endRow = start_row + data.length - 1;
  var range = sheet.getRange(
      'A' + start_row + ':' +
      'B' + endRow);
  if (data.length > 0) {
    range.setValues(data);
  }

  return;
}
