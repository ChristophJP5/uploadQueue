Drag and Drop upload, with Filequeue (JS Framework)

Add the "uploadQueue.min.js" to the bottom of your page.

Just use .uploadQue() on any file element to turn it into a uploadQueue element like:

    // create upload queue on all file inputs
    var fileInputs = document.querySelectorAll('[type="file"]');
    for (var a = 0; a < fileInputs.length; a++) {
        fileInputs[a].uploadQue();
    }
     


To get the data of the form just use .getFormData() on your form like this

    document.getElementById("formId").addEventListener('submit', getFormData)
    function getFormData (e){
        e.preventDefault();
        // sets form as formData(form) to build form data from this form
        var formData = this.getFormData(this); // get formData of form
        var request = new XMLHttpRequest();
        request.open(this.method, this.action);
        request.send(formData);
    }
