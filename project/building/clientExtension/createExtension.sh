#!/bin/bash

function createAddonInFolder() {
  local srcDir=$1
  local pathToConfig=$2
  local trgDir=$3
  local willMinify=$4

  rm -R $trgDir
  mkdir $trgDir

  if [ "$willMinify" == 1 ]
  then
    local pathToTrgManifest="$trgDir/manifest.json"
    cp "$srcDir/manifest.json" $pathToTrgManifest
    npx minify-json $pathToTrgManifest
  else
    cp "$srcDir/manifest.json" "$trgDir/manifest.json"
  fi

  mkdir "$trgDir/settings"
  npx html-minifier --file-ext 'html'\
    --collapse-inline-tag-whitespace\
    --collapse-whitespace\
    --remove-attribute-quotes\
    --remove-tag-whitespace\
    --input-dir "$srcDir/settings/"\
    --output-dir "$trgDir/settings/"
  compileCodeToFile "$srcDir/settings/settings.js" $pathToConfig "$trgDir/settings" "$willMinify" 'settings.js'

  mkdir './extension/background'
  compileCodeToFile "$srcDir/background/main.js" "$pathToConfig" "$trgDir/background" "$willMinify" 'main.js'
}

function compileCodeToFile() {
  local pathToSrcFile=$1
  local pathToConfig=$2
  local pathToTrgDir=$3
  local useMinification=$4
  local nameOfTrgFile=$5

  willMinify=$useMinification npx webpack build -c $pathToConfig --entry $pathToSrcFile -o $pathToTrgDir
  mv "$pathToTrgDir/main.js" "$pathToTrgDir/$nameOfTrgFile"
}

if [ "$1" != '--no-minify' ]
then
  willMinify=1
else
  willMinify=0
fi

srcDir='./../../src/clientExtension'
pathToConfig='./config.js'
trgDir='./extension'
pathToAddonFile='./browserControl.xpi'

createAddonInFolder $srcDir $pathToConfig $trgDir $willMinify
rm $pathToAddonFile

function createXpiFile() {
  7z a -tzip $1 $2
}

createXpiFile $pathToAddonFile "$trgDir/*"
