// ==UserScript==
// @name           Xtube Download Button
// @namespace      http://xtube.com
// @version        4.0.1
// @description    Adds a download buttons to Xtube and Pornhub with a formatted link from the savedeo.com download service, or a direct link with resolution options on Xtube.
// @author         persistentScripter
// @include        http*://www.xtube.com/*
// @include        *
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at         document-start
// ==/UserScript==

const snakeCase = (str) => {
  str = str.replace(/\W+/g, ' ').toLowerCase().split(' ').join('_');

  return str;
}

jQuery(document).ready(function($) {
  $('a#downloadVideoBtn').remove();

  var linkPath = 'https://savedeo.com/download?url=' + encodeURIComponent(document.URL);
  if (window.location.origin === 'http://www.xtube.com' || window.location.origin === 'https://www.xtube.com') {
    setTimeout(function() {
      let sources, files;

      if (typeof playerConf !== 'undefined') {
        sources = playerConf;
      } else {
        let s1 = $('#playerWrapper > script:nth-child(3)')
          .text()
          .split('var playerConf =')[1];
        if (s1) {
          s1 = s1.split(',\n')[0];
        }
        if (!s1) {
          s1 = $('#playerWrapper > script:nth-child(4)')
            .text()
            .split('var playerConf =')[1];
          if (s1) {
            s1 = s1.split(',\n')[0];
          }
        }
        try {
          sources = JSON.parse(s1);
        } catch (e) {
          console.log(e);
          try {
            sources = JSON.parse(s1.substr(0, s1.length - 1));
          } catch (e) {
            console.log(e);
          }
        }
      }

      //try {
        const fileName = `${snakeCase(document.querySelector('#mainSection > div.row.rowSpace.largeSpace.videoPage > div > form > h1').innerText.trim())}.mp4`;

        if (!sources.mainRoll) {
          sources.mainRoll = sources.media;
        }

        if (!sources.mainRoll) return;

        // Need to embed the buttons inside a modal because Xtube switched to web components, so we can't embed anything without a lot of monkey patching.
        $(document.body).append(`
          <div id="downloadModal" style="
            width: auto;
            height: auto;
            z-index: 9999;
            position: fixed;
            bottom: 0px;
            right: 0px;
            background-color: #E6E6E6;
            opacity: 0;
            transition: opacity 0.2s;
          " />
        `);

        if (sources.mainRoll.sources) {
          files = sources.mainRoll.sources;
        } else {
          files = sources.mainRoll.format;
        }

        let keys = Object.keys(files);

        for (let i = 0; i < keys.length; i++) {
          const resolution = keys[i].toString();
          const id = `downloadVideoFile_${resolution}`;
          const fileURL = files[keys[i]];
          const fileName2 = `${resolution}_${fileName}`

          $('#downloadModal').append(`
            <a
            download="${fileName2}"
            id="${id}"
            style="background-color: #E6E6E6;"
            href="${fileURL}"
            rel="nofollow"
            class="btn btn-outline bright"
            target="_blank">Download (${resolution})</a>
          `);

          let button = $(`#${id}`);

          button.on('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const {title} = document;

            document.title = `[↓] ${title.replace(/\[↓\]/g, '')}`;

            button.text(`Downloading... (${resolution})`);

            fetch('https://cors-anywhere.herokuapp.com/' + fileURL, {
              method: 'GET',
              headers: new Headers({origin: window.location.origin}),
            })
              .then(resp => resp.blob())
              .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');

                document.title = `[✓] ${title.replace(/\[✓\]/g, '')}`;
                button.text(`Download (${resolution})`);

                a.style.display = 'none';
                a.href = url;
                a.download = fileName2;

                document.body.appendChild(a);

                a.click();

                window.URL.revokeObjectURL(url);
              })
              .catch(() => {
                document.title = `[✗] ${title.replace(/\[✗\]/g, '')}`;
                button.text(`Download (${resolution})`);

                window.open(fileURL)
              });
          });
        }

        setTimeout(() => Object.assign(document.getElementById('downloadModal').style, {
          opacity: 1,
        }), 0)
      // } catch (e) {
      //   console.log(e);
      // }
    }, 1000);
  } else if (window.location.origin === 'http://www.pornhub.com') {
    $('<div class="tab-menu-wrapper-cell xdl"><div class="tab-menu-item"><i class="main-sprite-dark-2"></i><span>Download File</span></div>').insertAfter('div.tab-menu-wrapper-row>div:nth-child(3)');
    $('.tab-menu-wrapper-cell.xdl').click(function(e) {
      e.preventDefault();
      window.open(linkPath);
    });
  }
});
