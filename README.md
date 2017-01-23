# youtube-comments-task

[![Build Status](https://travis-ci.org/philbot9/youtube-comments-task.svg?branch=master)](https://travis-ci.org/philbot9/youtube-comments-task)

## Usage

The module exports a single function:

`fetchComments(videoId[, pageToken])`

The function accepts the YouTube `videoId` and an optional `pageToken`, and returns a Task that resolves to the corresponding page of comments. If the `pageToken` is not provided it fetches the first page of comments.

## Task

The module uses [Folktale's Task monad](http://docs.folktalejs.org/en/latest/api/data/task/) ([data.task](https://github.com/folktale/data.task)) to handle asynchronicity and to allow for easy composition.

## Examples

``` javascript
const fetchComments = require('youtube-comments-task')

fetchComments('h_tkIpwbsxY')
  .fork(e => console.error('ERROR', e),
        p => {
          console.log('comments', p.comments)
          console.log('nextPageToken', p.nextPageToken)
        })
```

``` javascript
const Task = require('data.task')
const fetchComments = require('youtube-comments-task')

const fetchAllComments = (videoId, pageToken, fetched = []) =>
    fetchComments(videoId, pageToken)
      .chain(({ comments, nextPageToken }) =>
        nextPageToken
          ? fetchAllComments(videoId, nextPageToken, fetched.concat(comments))
          : Task.of(fetched.concat(comments)))

fetchAllComments('h_tkIpwbsxY')
  .fork(e => console.error('ERROR', e),
        allComments => console.log(allComments))

```
