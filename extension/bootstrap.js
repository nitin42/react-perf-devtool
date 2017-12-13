chrome.devtools.panels.create("React Perf",
    '', // should be an icon image
    'load.html',
    function(panel) {
      console.log('Started React Perf');
    }
);