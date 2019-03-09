import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types'
import {render, Box, Text, Color} from 'ink';
var chokidar = require('chokidar')
var debounce = require('debounce')
var shell = require('shelljs')

const RunningSummary = ({path}) => (
	<Box flexDirection="column" marginTop={1}>
		<Box>
			<Box width={15}>
				<Color bold dim>
				  Current state:
				</Color>
			</Box>
			<Color bgYellow black> RUNNING </Color>
		</Box>
		<Box>
			<Color dim>Detected change to:</Color> {path}
		</Box>
	</Box>
)

const PassSummary = ({outputText, failureText}) => (
	<Box flexDirection="column" marginTop={1}>
		<Box>
			<Box width={15}>
			  <Color bold dim>
					Current state: 
				</Color>
			</Box>
			<Color bgGreen black> PASSED </Color>
		</Box>

		<Box marginTop={1}>{outputText + failureText}</Box>
	</Box>
);

const FailSummary = ({outputText, failureText}) => (
	<Box flexDirection="column" marginTop={1}>
		<Box>
			<Box width={15}>
			  <Color bold dim>
					Current state: 
				</Color>
			</Box>
			<Color bgRed black> FAILED </Color>
		</Box>

		<Box marginTop={1}>{outputText + failureText}</Box>
	</Box>
	
);

var buildAndTestCommand = process.argv.slice(2)[0]

const doSomethingBob = debounce((event, path) => { 
	render(<RunningSummary path={path}/>)

	var runCommand = shell.exec(buildAndTestCommand, {silent:true})

	if (runCommand.code !== 0) {
		render( <FailSummary outputText={runCommand.stdout} failureText={runCommand.stderr} /> );
	} else {
		render( <PassSummary outputText={runCommand.stdout} failureText={runCommand.stderr} /> );
	}
}, 1)

chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  doSomethingBob(event, path);
});
 
   