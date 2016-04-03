var d = document;
var uploadQueObj = {
    filesVar: {}, // file object to store all pictures
    types: ["jpg", "png", "bmp", "jpeg"], // defines to pictures only (Needs a check on Server side too)
    fileChange: function (e) {
        // get's fired when files get added to the form
        var files = this.files; // all files from form
        var form = uploadQueObj.getFormName(e);
        var inputName = this.name; // name attr of this form (multiple forms)
        for (var a = 0; a < files.length; a++) {
            // define the vars of the file
            var file = files[a];
            var fileName = file.name;
            var lastPoint = fileName.lastIndexOf('.') + 1;
            var fileExtension = fileName.substring(lastPoint, fileName.length);

            // check file extension on user side to prevent unnecessary data-transfer
            if (uploadQueObj.types.indexOf(fileExtension) != -1) {
                // add file to object
                uploadQueObj.filesVar[form][inputName][fileName] = file;
            }
        }
        // rebuild the queue
        uploadQueObj.buildQueue(e);
    },
    deleteQueueEntry: function (e) {
        var inputName = this.getAttribute("data-input-name");
        var fileName = this.getAttribute("data-file-name");
        var form = uploadQueObj.getFormName(e);
        // remove img from queue
        delete uploadQueObj.filesVar[form][inputName][fileName];
        // rebuild the queue
        uploadQueObj.buildQueue(e);
    },
    getFormName: function (e) {
        var form = e.target;
        while (form.nodeName != "FORM" && form.parentNode) {
            form = form.parentNode;
        }
        return form.getAttribute("data-form-name");
    },
    buildQueue: function (e) {
        // rebuild the queue
        // define the vars
        var form = uploadQueObj.getFormName(e);
        var filesVar = uploadQueObj.filesVar[form];
        var inputKeys = Object.keys(filesVar);
        var queElement = e.target.parentNode.parentNode.lastChild;
        if (queElement.className == "uploadQueue-queue-element") {
            // if is sub element
            queElement = queElement.parentNode;
        }
        queElement.innerHTML = ""; // clear whole element
        for (var a = 0; a < inputKeys.length; a++) {
            // for all inputs
            var inputName = inputKeys[a]; // input name from object
            var fileKeys = Object.keys(filesVar[inputName]);
            var fileObj = filesVar[inputName]; // file object from
            for (var b = 0; b < fileKeys.length; b++) {
                // for all files
                var file = fileObj[fileKeys[b]]; // single file
                var fileName = file.name; // get file name
                var queueFileDelete = d.createElement("div")
                var queueFile = d.createElement("div")
                var queueFileName = d.createElement("p")

                // Create a new file queue entry
                queueFile.className = "uploadQueue-queue-element";

                queueFileName.className = "uploadQueue-queue-element-name";
                queueFileName.innerText = fileName;

                // create delete File element
                queueFileDelete.setAttribute("data-input-name", inputName);
                queueFileDelete.setAttribute("data-file-name", fileName);
                queueFileDelete.className = "uploadQueue-queue-element-delete";
                queueFileDelete.innerText = "X";
                queueFileDelete.addEventListener('click', uploadQueObj.deleteQueueEntry)

                // create file entry queue
                queueFile.appendChild(queueFileName)
                queueFile.appendChild(queueFileDelete)
                queElement.appendChild(queueFile)
            }
        }
    },
    getFormData: function (e, formElement) {
        var formData = new FormData(formElement)
        var form = uploadQueObj.getFormName(e);
        var filesVar = uploadQueObj.filesVar[form];
        var inputKeys = Object.keys(filesVar);
        for (var a = 0; a < inputKeys.length; a++) {
            var inputName = inputKeys[a];
            var fileKeys = Object.keys(filesVar[inputName]);
            var files = filesVar[inputName];
            var input = d.createElement("input");
            for (var b = 0; b < fileKeys.length; b++) {
                var fileName = fileKeys[b];
                var file = files[fileName];
                formData.append(inputName + "[" + b + "]", file)
            }
        }
        return formData;
    }
}
Element.prototype.getFormData = function (form) {
    var event = {
        target: this
    }
    return uploadQueObj.getFormData(event, form);
}
Element.prototype.uploadQue = function () {
    // check if name attr is set
    if (this.name == "") {
        console.error("Name attribute is not defined in element");
        console.log(this)
        return;
    }
    var formName = "uploadQueue-" + Date.now() + Math.floor((Math.random() * 2000) + 1);
    uploadQueObj.filesVar[formName] = {};
    uploadQueObj.filesVar[formName][this.name] = {};
    var fileEl = this.cloneNode(true);
    var uploadQueElement = d.createElement("div");
    var uploadQueFileHolderElement = d.createElement("div");
    var uploadQueQueueHolderElement = d.createElement("div");

    // set Element attributes
    uploadQueElement.className = "uploadQueue-holder";
    uploadQueFileHolderElement.className = "uploadQueue-file-holder";
    uploadQueQueueHolderElement.className = "uploadQueue-queue-holder";

    // append all the childs
    uploadQueFileHolderElement.appendChild(fileEl);
    uploadQueElement.appendChild(uploadQueFileHolderElement);
    uploadQueElement.appendChild(uploadQueQueueHolderElement);

    // add event listener
    this.form.addEventListener('getFormData', uploadQueObj.getFormData);
    this.form.setAttribute("data-form-name", formName);
    fileEl.addEventListener('change', uploadQueObj.fileChange);

    // replace the original input
    this.parentNode.replaceChild(uploadQueElement, this)
};
