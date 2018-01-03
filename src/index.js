const fs = require('fs');
const pify = require('pify');
const path = require('path');
function mkdirs(dirname, callback) {  
  fs.exists(dirname, function (exists) {  
      if (exists) {  
          callback();  
      } else {  
          //console.log(path.dirname(dirname));  
          mkdirs(path.dirname(dirname), function () {  
              fs.mkdir(dirname, callback);  
          });  
      }  
  });  
} 
function CopyStaticFilePlugin(patterns){
  if(!Array.isArray(patterns)){
    throw new Error('patterns must be an array');
  }
  this.patterns = patterns;
}
CopyStaticFilePlugin.prototype.apply = function(compiler){
  let self = this;
  compiler.plugin('after-emit',function(compilation,cb){
    let mkdirsArr = [];
    let filesArr = [];
    let keys = Object.keys(compilation.assets);
    self.patterns.forEach(function(item){
      keys.forEach(function(key){
        if(key.endsWith(item.type)){
          let pathstr = path.resolve(item.to,key);
          mkdirsArr.push(path.dirname(pathstr));
          let writetask = transformObject(pathstr,item,compilation.assets[key].source());
          compilation.assets[writetask.name] = {
            size: function() {
              return writetask.asset.length;
            },
            source: function() {
                return writetask.asset;
            }
          }
          filesArr.push(writetask);
        }
      });   
    });
    doTask(mkdirsArr,filesArr).then(function(){
      
      cb();
    });
  });
  compiler.plugin("done",function(stats){
    console.log(stats);
  });
  
}

function transformObject(path,options,source){
    switch (options.totype){
      case 'jsp' :
        return {name:changeSuffix(path,'.jsp'),asset:toJsp(source)}
      default :
        return {name:path,asset:source}
    }
}

function changeSuffix(path,suffix){
  return path.replace(/\.[A-Za-z]+$/,suffix);
}
function toJsp(source){
  let headStr = '<%@ page contentType="text/html;charset=UTF-8" language="java" %>';
  return [headStr,source].join("\\n");
}
async function doTask(dirsArr,filesArr){
  try{
    await createDirs(dirsArr);
    await writeFiles(filesArr);
  }catch(err){
    console.log(err.toString());
  } 
}

async function createDirs(mkdirsArr){
  await Promise.all(createMkdirTasks(mkdirsArr));
}
function createMkdirTasks(arr){
  let taskArr = arr.map(function(item){
    return pify(mkdirs)(item);
  });
  return taskArr || [];
}

async function writeFiles(filesArr){
  await Promise.all(createwriteFilesTask(filesArr));
}

function createwriteFilesTask(arr){
  let taskArr = arr.map(function(item){
    return pify(fs.writeFile)(item.name,item.asset);
  });
  return taskArr || [];
}



module.exports = CopyStaticFilePlugin;