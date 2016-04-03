Drag and Drop upload, with Filequeue (JS Framework)

Add the "uploadQueue.min.js" to the bottom of your page.

Just use .uploadQue() on any file element to turn it into a uploadQueue element like:

    // create upload queue on all file inputs
    var fileInputs = document.querySelectorAll('[type="file"]');
    for (var a = 0; a < fileInputs.length; a++) {
        fileInputs[a].uploadQue();
    }
     
