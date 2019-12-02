/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}
    
    // getElementByClass
	function $class(clas) {
		return document.getElementsByClassName(clas);
	}

	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
        if (e.type == "dragover")
            e.target.className =  e.target.className.split(' ')[0] + ' hover';
        else
            e.target.className =  e.target.className.split(' ')[0];
	}

	// output file information
	function OutputFile(e, id) {
        var files = e.target.files || e.dataTransfer.files;
        
        $id(id).files = files;
	}
    
	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);
        
		// Output File objects
        if (e.target.id == 'dragProblem')
		    OutputFile(e, 'fileProblem');
        else if (e.target.id == 'dragSolution')
            OutputFile(e, 'fileSolution');
	}


	// initialize
	function Init() {

		var fileselect = $class("fileselect"),
			filedrag = $class("filedrag");

		// file select
        [].forEach.call(fileselect, element => element.addEventListener("change", FileSelectHandler, false));

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
            [].forEach.call(filedrag, element => { 
                // file drop
                element.addEventListener("dragover", FileDragHover, false);
                element.addEventListener("dragleave", FileDragHover, false);
                element.addEventListener("drop", FileSelectHandler, false);
                element.style.display = "block";
            });
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();