$(document).ready(function(){
  // 64 bit MacOS + 64 bit Safari or 32 bit Chrome:

  var platform;
  var architecture;

  switch(window.navigator.platform){
    case 'MacIntel':
      // Mac
      platform = 'darwin';
      architecture = 'x64';
    break;
    case 'Win32':
    case 'Win64':
      // Windows
      platform = 'win32'
      architecture = 'ia32';
      if(window.navigator.cpuClass === 'x64'){
        architecture = 'x64';
      }

    break;
    case 'Linux i686':
      platform = 'linux';
      architecture = 'ia32';

    case 'Linux x86_64':
      platform = 'linux';
      architecture = 'x64';

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

  output += '<a class="download_link" href="' + base_path + version + '/song2stream-' + platform + '-' + architecture + '.zip">Download Here</a>'

  $('body').html(output);



  $('.download_link').on('click', function(){
    console.log('download');
    ga('send', 'event', 'Download', 'download', version + '-' + platform + '-' + architecture);
  });

});
