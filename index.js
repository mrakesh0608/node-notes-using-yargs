//Chalk -Start
const chalk = require('chalk');
const warnC = chalk.bgRed.black;
const DoneC = chalk.bgGreen.black;
const titleC = chalk.bgYellow.black;
const listC = chalk.bgBlue.black;
//Chalk -End

//FileSystem Read & Write -Start
const fs = require('fs');

function readNotes()
{
    try 
    {
        const data = fs.readFileSync('./notes.json','utf-8');
        try
        {
            let notes = JSON.parse(data);
            // console.log(notes);
            return notes;
        } 
        catch (err){console.log("Error parsing JSON",err);}
    }
    catch (err) {console.log(err);}
}
function writeNotes(newnotes)
{
    fs.writeFile('./notes.json',newnotes,(err)=>{
        if(err) console.log(err);
        // else console.log(DoneC("Notes Updated"));
    })
}
//FileSystem Read & Write -End

//Operations Arguments -Start
const yarg = require('yargs');

yarg.command({
	command: 'add',
	describe: 'add a new note',
	builder: {
		title: {
			describe: 'Title of note',
			demandOption: true,
			type: 'string'	
		},
		body: {
			describe: 'Body of note',
			demandOption: true,
			type: 'string'
		}
	},
	handler(argv) 
    {
        const title = argv.title;
        const desc = argv.body;
        console.log(title,desc);
        let notes = readNotes();

        if(notes[title] == undefined) //check existence
        {
            notes[title] = {desc:desc};
            const newnotes = JSON.stringify(notes,null,2);
            writeNotes(newnotes);
            console.log(DoneC("New Note Added"));
        }
        else console.log(warnC("Title already taken"));
	}
});

yarg.command({
	command: 'remove',
	describe: 'remove a note',
	builder: {
		title: {
			describe: 'Title of note',
			demandOption: true,
			type: 'string'	
		}
	},
	handler(argv) 
    {
        const title = argv.title;
        let notes = readNotes();
        if(notes[title] != undefined)
        {
            delete notes[title];
            const newnotes = JSON.stringify(notes,null,2);
            writeNotes(newnotes);
            console.log(DoneC("note " +title +" removed"));
        }
        else console.log(warnC("Note not found"));
	}
});

yarg.command({
	command: 'list',
	describe: 'list all note-titles',
	handler(argv)
    {
		const notes = readNotes();
        let titles = Object.keys(notes);
        if(titles.length >0)
        {
            console.log(listC("\nYour Notes"));
            for(let i=0; i<titles.length; i++)
            {
                console.log(titles[i]);
            }
        }
        else console.log(warnC("\nNo notes"));
	}
});

yarg.command({
	command: 'read',
	describe: 'read a note',
	builder: {
		title: {
			describe: 'Title of note',
			demandOption: true,
			type: 'string'	
		}
	},
	handler(argv) 
    {
        const title = argv.title;
        const notes = readNotes();
        if(notes[title] != undefined)
        {
            console.log(titleC(title));
            console.log(notes[title].desc);
        }
        else console.log(warnC("Note not found"));
	}
});

yarg.parse()
//Operations Arguments -End