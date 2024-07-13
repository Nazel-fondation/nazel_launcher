async function getAllocatedMemory() {
    const Store = await import('electron-store');
    const store = new Store.default();
    if (store.has("allocatedMemory")){
        return store.get("allocatedMemory")
    }else{
        return 2
    }
}

async function updateAllocatedMemory(memoryValue){
    const Store = await import('electron-store');
    const store = new Store.default();
    store.set("allocatedMemory", memoryValue);
}

//If I send 2 at minercaft-launcher-core it's an error because we had to precise if the value is in G for example
async function convertedAllocatedMemoryForMinecraft(){
    const memory = await getAllocatedMemory(); 
    return (memory + "G")
}

module.exports = {getAllocatedMemory, updateAllocatedMemory,convertedAllocatedMemoryForMinecraft}