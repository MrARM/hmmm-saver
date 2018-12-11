import snoostorm from 'snoostorm';
import snoowrap from 'snoowrap';
import credentials from './credentials.json';
import request from 'request';
import fs from 'fs';

// Check for images dir
const dir = './images';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const client = new snoostorm(new snoowrap(credentials));

const submissionStream = client.SubmissionStream({
    'subreddit': 'hmmm',
    'results': 5
});

submissionStream.on("submission", (post) => {
  console.log(`New post! ${post.id}`);
    request.head(post.url, function(err, res, body){
        request(post.url).pipe(fs.createWriteStream(`${dir}/${post.title}_${post.id}.png`)).on('close', ()=>{console.log(`Downloaded ${post.id}`)});
    });
});

process.on('SIGINT', function() {
    console.log('Shutting down, this will take a second...');
    submissionStream.emit('stop');
    setTimeout(()=> {
        process.exit();
    }, 5000);
});