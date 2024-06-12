const choosePhotoSize = (sizes) => {
    if(!sizes || !Array.isArray(sizes) || sizes.length === 0) return null;
    if(sizes.length === 1) return sizes[0];

    const photoSizePriority = ['y', 'd', 'x', 'c', 'w', 'b', 'm', 'a', 's'];
    try{
        for (const size_type of photoSizePriority) {
            const s = sizes.find((photoSize) => photoSize.type === size_type);
            if (s) return s;
        }
    } catch (e) {
        console.log("can't choose Photo Size [choosePhotoSize]");
        console.log(e);
    }

    return sizes[sizes.length - 1]
}

module.exports=choosePhotoSize;