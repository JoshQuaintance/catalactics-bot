function fields(...arr) {
	
	return arr.map(ar => {
  	return {name: ar[0], value: ar[1]}
  }) 

  
}

module.exports = fields;