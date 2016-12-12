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



  console.log(version)
  console.log(platform);
  console.log(architecture);


  ga('send', 'event', 'Download', 'view', version + '-' + platform + '-' + architecture);



  output += 'Version: ' + version + '<br>';
  output += 'Platform: ' + platform + '<br>';
  output += 'Architecture: ' + architecture + '<br>';

  // For use when use s3 eventually
  //output += '<a class="download_link" href="' + base_path + version + '/song2stream-' + platform + '-' + architecture + '.zip">Download Here</a>'

  // For Dropbox
  output += '<a class="download_link" href="' + link + '">Download Here</a>'


  $('body').html(output);



  $('.download_link').on('click', function(){
    console.log('download');
    ga('send', 'event', 'Download', 'download', version + '-' + platform + '-' + architecture);
  });

});
