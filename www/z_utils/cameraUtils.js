function scan(successCallback, failureCallback)
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
                    successCallback(result.text);
                }
            }
        },
        function (error) {
            failureCallback();
        }
   );
}
