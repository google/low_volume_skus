# Low Volume SKUs

This is a solution to be used by shopping Customers (CSS, GCS). It consists of a
script (js) to be run in Google Ads Scripts. It uses Google Ads API (the
previous version used AdWords API, which is [deprecated](https://ads-developers.googleblog.com/2022/03/the-adwords-api-sunsets-on-april-27-2022.html)).

## Requirements to use the Script

*   Merchant Center Sub Account (*not MCA*)
*   A Spreadsheet with 2 columns (for supplemental feed).
*   A free custom Label (otherwise existing values will be replaced with the
values from supplemental feed.)

NOTE: MCAs require a combination of various components (CF, BQ, GCS) to use
supplemental feeds - which won't work with this - so a solution is WIP.

## Steps to implement the script

Here is a simplified overview of the steps. A detailed step by step description
can be found in the deck below. *
[Implementation Deck](https://services.google.com/fh/files/helpcenter/zombie2.pdf)

1.  Create a new spreadsheet and name columns 1 and 2 (cells A1 and B1) 'id' and
    'custom_label_0-4' (eg. custom_label_4).
2.  Create a new Google Ads Script (Tools settings > Bulk Actions > Scripts).
3.  Copy the
    [script](https://github.com/google/low_volume_skus/blob/main/low_volume_skus.js)
    content and paste in the newly created Google Ads Script.
4.  **REPLACE** (at least) the variables for: * CUSTOM_LABEL_NR, *
    SPREADSHEET_URL,
5.  **Check** other variables that you may want to change: * THRESHOLD,
    USE_CAMPAIGN_FILTER, FILTER_CAMPAIGN_NAME, PRODUCT_ID_CAPITALISED,
    TIME_DURATION, and/or COUNT_LIMIT.
6.  Authorize your script to run in Google Ads Account. 7. Run the script (you
    can also hit preview) and check for potential errors in the execution logs
    or in your spreadsheet.
7.  Set a frequency to run your script automatically. 9. Create a supplemental
    feed in your Google Merchant Center account, using the spreadsheet created
    above.
8.  Create a new Low Volume SKU campaign and use inventory filters to target
    items via the custom label.

Note: It is important that both schedules (from script and supplemental feed)
are timed correctly so that new labeled product are properly picked up.

## Known issues

1.  If capitalised offer_ids are used - script must be adjusted based on the
naming convention as Ads API converting offer_id values to lowercase which will
cause mismatch during supplemental feed processing. Please use PRODUCT_ID_CAPITALISED
flag to convert offer_id's to upper case.

## Licensing

Terms of the release - Copyright 2021 Google LLC. Licensed under the Apache
License, Version 2.0.

**This is not an officially supported Google product.**
