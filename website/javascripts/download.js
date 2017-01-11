$(document).ready(function(){
  // 64 bit MacOS + 64 bit Safari or 32 bit Chrome:

  var platform;
  var architecture;
  var version = '0.4.2';
  var link = '';


  switch(window.navigator.platform){
    case 'MacIntel':
      // Mac
      platform = 'darwin';
      architecture = 'x64';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/'+ version +'/song2stream-darwin-x64.zip';

    break;
    case 'Win32':
    case 'Win64':
      // Windows
      platform = 'win32'
      architecture = 'ia32';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/'+ version +'/song2stream-win32-ia32.zip';


      if(window.navigator.cpuClass === 'x64'){
        architecture = 'x64';
        link = 'https://github.com/bobbylaporte/song2stream/releases/download/'+ version +'/song2stream-win32-x64.zip';
      }

    break;
    case 'Linux i686':
      platform = 'linux';
      architecture = 'ia32';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/'+ version +'/song2stream-linux-ia32.zip';

    case 'Linux x86_64':
      platform = 'linux';
      architecture = 'x64';
      link = 'https://github.com/bobbylaporte/song2stream/releases/download/'+ version +'/song2stream-linux-x64.zip';

    break;
  }



  var output = '';


  var base_path = 'http://www.bobbylaporte.com/song2stream/releases/'
  // Send analytics event and then redirect to proper file



  ga('send', 'event', 'Download', 'view', version + '-' + platform + '-' + architecture);


  switch(platform){
    case 'darwin':
      $('.big-ass-button i').addClass('fa-apple');
    break;
    case 'win32':
      $('.big-ass-button i').addClass('fa-windows');
    break;
    case 'linux':
      $('.big-ass-button i').addClass('fa-linux');
    break;
  }

  $('.download-helper .version span').text(version);
  $('.download-helper .platform span').text(platform);
  $('.download-helper .architecture span').text(architecture);

  $('.big-ass-button').attr('href', link);


  $('.download-helper .big-ass-button').on('click', function(){
    console.log('download');
    ga('send', 'event', 'Download', 'download', version + '-' + platform + '-' + architecture);
  });


  if(platform && version && architecture){
    $('.download-helper').show();
  }


});
