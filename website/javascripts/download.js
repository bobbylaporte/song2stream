$(document).ready(function(){
  // 64 bit MacOS + 64 bit Safari or 32 bit Chrome:

  var platform;
  var architecture;


  var link = '';


  switch(window.navigator.platform){
    case 'MacIntel':
      // Mac
      platform = 'darwin';
      architecture = 'x64';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/0.0.1/song2stream-darwin-x64.zip';

    break;
    case 'Win32':
    case 'Win64':
      // Windows
      platform = 'win32'
      architecture = 'ia32';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/0.0.1/song2stream-win32-ia32.zip';


      if(window.navigator.cpuClass === 'x64'){
        architecture = 'x64';
        link = 'https://github.com/bobbylaporte/song2stream/releases/download/0.0.1/song2stream-win32-x64.zip';
      }

    break;
    case 'Linux i686':
      platform = 'linux';
      architecture = 'ia32';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/0.0.1/song2stream-linux-ia32.zip';

    case 'Linux x86_64':
      platform = 'linux';
      architecture = 'x64';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/0.0.1/song2stream-linux-x64.zip';

    break;
  }



  var version = '0.0.1';

  var output = '';




  var base_path = 'http://www.bobbylaporte.com/song2stream/releases/'
  // Send analytics event and then redirect to proper file



  ga('send', 'event', 'Download', 'view', version + '-' + platform + '-' + architecture);


  switch(platform){
    case 'darwin':
      $('.download-helper .big-ass-button a').addClass('fa-apple');
    break;
    case 'win32':
      $('.download-helper .big-ass-button a').addClass('fa-windows');
    break;
    case 'linux':
      $('.download-helper .big-ass-button a').addClass('fa-linux');
    break;
  }

  $('.download-helper .version span').text(version);
  $('.download-helper .platform span').text(platform);
  $('.download-helper .architecture span').text(architecture);


  $('.download-helper .big-ass-button').on('click', function(){
    console.log('download');
    ga('send', 'event', 'Download', 'download', version + '-' + platform + '-' + architecture);

    window.location.assign(link);
  });

});
