export function setLogger(error: Error | any) {
    console.log(`WARN - AT ${new Date().toLocaleDateString()} @ ${error?.message || 'Have a error'}`)   
}