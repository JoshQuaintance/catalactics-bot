export default function fields(...arr: any[]): {name: any, value: any}[] {

	return arr.map(ar => {
  	    return {name: ar[0], value: ar[1]}
    });


}

