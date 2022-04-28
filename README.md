# Low Volume SKUs

This is a solution to be used by shopping Customers (CSS, GCS).
It consists of a script (js) to be run in Google Ads Scripts.
It uses Google Ads API (the previous version used AdWords API, which is deprecated).

## Requirements to use the Script
 * Merchant Center Sub Account (*not MCA*)
 * A Spreadsheet with 2 columns (for supplemental feed).
 * A free custom Label

NOTE: MCAs require the API to use supplemental feeds - which won't work with this - so a solution is WIP.

## Steps to implement the script

Here is a simplified overview of the steps. A detailed step by step description can be found in the deck below.
 * [Implementation Deck](https://docs.google.com/presentation/d/10aQ8DYHoaeqQPcBUQfSOGV8tsLXs3l8T12FHtj5IUiQ/edit#slide=id.g7ca20d0e9a_0_0)
 1. Create a new spreadsheet and name columns 1 and 2 (cells A1 and B1) 'id' and 'custom_label#' where # is the nr of the label chosen (eg. custom_label4).
 2. Create a new Google Ads Script (Tools settings > Bulk Actions > Scripts).
 3. Copy the script content and paste in the newly create Google Ads Script.
 4. **REPLACE** (at least) the variables for:
    * CUSTOM_LABEL_NR, SPREADSHEET_URL,
 5. **Check** other variables that you may want to change:
    * THRESHOLD, USE_CAMPAIGN_FILTER, FILTER_CAMPAIGN_NAME, TIME_DURATION, and/or COUNT_LIMIT.
 6. Create a supplemental feed, using the spreadsheet above. It is important that both schedules (from script and supplemental feed) so that new labeled product are properly picked up.
 7. Create a campaign to target and ramp up the low_volume label.

## Licensing

Terms of the release - Copyright 2021 Google LLC. Licensed under the Apache
License, Version 2.0.

**This is not an officially supported Google product.**

