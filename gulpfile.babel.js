import 'babel-polyfill'
import eslint from 'gulp-eslint'
import gulp from 'gulp'
import fs from 'fs'
import {sortBy} from 'lodash'
import {generateFromEnums} from './src/messagesHelpers'

gulp.task('default', ['messages-extract'])

/*
 * Messages tasks
 */
gulp.task('messages-extract', () => {
  const through = require('through2')
  const babel = require('babel-core')
  const enums = require('./src/common/enum')
  const messages = generateFromEnums(enums)

  const getReactIntlMessages = (code) => babel.transform(code, {
    plugins: ['react-intl'],
    presets: ['react'],
  }).metadata['react-intl'].messages

  return gulp.src([
    './src/messages/*.js',
  ]).pipe(through.obj((file, enc, cb) => {
    const code = file.contents.toString()
    const fileReference = file.relative

    messages.push(...getReactIntlMessages(code).map((message) => ({
      ...message,
      sourceFile: fileReference,
    })))
    cb(null, file)
  })).on('end', () => {
    const data = {}
    sortBy(messages, 'id').forEach((message) => (data[message.id] = message.defaultMessage))
    fs.writeFileSync('./src/translations/en.json', JSON.stringify(data, null, 2))
  })
})

gulp.task('eslint', () => {
  return gulp.src([
    '**/*.js',
    '!node_modules/**',
  ]).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
