module.exports={
    convertToCamelCase(message){
        let split=message.split(' ')
        split.forEach((element,index) => {
            split[index]=element.replace(element.charAt(0),element.charAt(0).toUpperCase())
        });
        return split.join(' ')
    }
}