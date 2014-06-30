#! /usr/bin/env coffee

fs = require "fs"
path = require "path"
markdown = require("markdown").markdown
S = require "string"

src = __dirname + "/../blog/articles/markdown"
dest = __dirname + "/../blog/articles/html"

convert = (name, src, dest) ->
  fs.readFile path.join(src, name + ".markdown"), (err, data) ->
    throw err if err?
    html = markdown.toHTML data.toString()
    fs.writeFile path.join(dest, name + ".html"), html, (err) ->
      throw err if err?
      console.log "Convert file [" + name + ".markdown] successfully."

fs.readdir src, (err, files) ->
  throw err if err?
  for file in files
    if S(file).endsWith ".markdown"
      name = file.substring 0, file.length - 9
      convert name, src, dest
