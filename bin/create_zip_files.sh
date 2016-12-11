#check if this is a tagged release. if so proceed
cd packages

#loop through all packages and zip em up
for i in */; do zip -r "${i%/}.zip" "$i"; done

#upload the zips to s3 in a folder named /releases/X.X.X/
