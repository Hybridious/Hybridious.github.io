const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewSection = document.getElementById('previewSection');
const convertBtn = document.getElementById('convertBtn');
const status = document.getElementById('status');
const scaleInput = document.getElementById('scale');
const usernameInput = document.getElementById('usernameInput');
const fetchBtn = document.getElementById('fetchBtn');

let skinImage = null;
let originalFilename = 'statue';

const ALL_BLOCKS = {
    concrete: [
        { id: 251, data: 0, rgb: [207, 213, 214] },
        { id: 251, data: 1, rgb: [224, 97, 1] },
        { id: 251, data: 2, rgb: [169, 48, 159] },
        { id: 251, data: 3, rgb: [36, 137, 199] },
        { id: 251, data: 4, rgb: [241, 175, 21] },
        { id: 251, data: 5, rgb: [94, 169, 24] },
        { id: 251, data: 6, rgb: [214, 101, 143] },
        { id: 251, data: 7, rgb: [55, 58, 62] },
        { id: 251, data: 8, rgb: [125, 125, 115] },
        { id: 251, data: 9, rgb: [21, 119, 136] },
        { id: 251, data: 10, rgb: [100, 32, 156] },
        { id: 251, data: 11, rgb: [45, 47, 143] },
        { id: 251, data: 12, rgb: [96, 60, 32] },
        { id: 251, data: 13, rgb: [73, 91, 36] },
        { id: 251, data: 14, rgb: [142, 33, 33] },
        { id: 251, data: 15, rgb: [8, 10, 15] }
    ],
    wool: [
        { id: 35, data: 0, rgb: [233, 236, 236] },
        { id: 35, data: 1, rgb: [216, 127, 51] },
        { id: 35, data: 2, rgb: [178, 76, 216] },
        { id: 35, data: 3, rgb: [102, 153, 216] },
        { id: 35, data: 4, rgb: [229, 229, 51] },
        { id: 35, data: 5, rgb: [127, 204, 25] },
        { id: 35, data: 6, rgb: [242, 127, 165] },
        { id: 35, data: 7, rgb: [76, 76, 76] },
        { id: 35, data: 8, rgb: [153, 153, 153] },
        { id: 35, data: 9, rgb: [76, 127, 153] },
        { id: 35, data: 10, rgb: [127, 63, 178] },
        { id: 35, data: 11, rgb: [51, 76, 178] },
        { id: 35, data: 12, rgb: [102, 76, 51] },
        { id: 35, data: 13, rgb: [102, 127, 51] },
        { id: 35, data: 14, rgb: [153, 51, 51] },
        { id: 35, data: 15, rgb: [25, 25, 25] }
    ],
    terracotta: [
        { id: 159, data: 0, rgb: [209, 177, 161] },
        { id: 159, data: 1, rgb: [161, 83, 37] },
        { id: 159, data: 2, rgb: [149, 87, 108] },
        { id: 159, data: 3, rgb: [113, 108, 137] },
        { id: 159, data: 4, rgb: [186, 133, 36] },
        { id: 159, data: 5, rgb: [103, 117, 53] },
        { id: 159, data: 6, rgb: [161, 78, 78] },
        { id: 159, data: 7, rgb: [57, 42, 35] },
        { id: 159, data: 8, rgb: [135, 107, 98] },
        { id: 159, data: 9, rgb: [87, 92, 92] },
        { id: 159, data: 10, rgb: [122, 73, 88] },
        { id: 159, data: 11, rgb: [76, 62, 92] },
        { id: 159, data: 12, rgb: [76, 50, 35] },
        { id: 159, data: 13, rgb: [76, 83, 42] },
        { id: 159, data: 14, rgb: [143, 61, 46] },
        { id: 159, data: 15, rgb: [37, 23, 16] }
    ],
    glass: [
        { id: 95, data: 0, rgb: [242, 242, 242] },
        { id: 95, data: 1, rgb: [216, 127, 51] },
        { id: 95, data: 2, rgb: [178, 76, 216] },
        { id: 95, data: 3, rgb: [102, 153, 216] },
        { id: 95, data: 4, rgb: [229, 229, 51] },
        { id: 95, data: 5, rgb: [127, 204, 25] },
        { id: 95, data: 6, rgb: [242, 127, 165] },
        { id: 95, data: 7, rgb: [76, 76, 76] },
        { id: 95, data: 8, rgb: [153, 153, 153] },
        { id: 95, data: 9, rgb: [76, 127, 153] },
        { id: 95, data: 10, rgb: [127, 63, 178] },
        { id: 95, data: 11, rgb: [51, 76, 178] },
        { id: 95, data: 12, rgb: [102, 76, 51] },
        { id: 95, data: 13, rgb: [102, 127, 51] },
        { id: 95, data: 14, rgb: [153, 51, 51] },
        { id: 95, data: 15, rgb: [25, 25, 25] }
    ]
};

function getActivePalette() {
    const palette = [];
    
    if (document.getElementById('useConcrete').checked) {
        palette.push(...ALL_BLOCKS.concrete);
    }
    if (document.getElementById('useWool').checked) {
        palette.push(...ALL_BLOCKS.wool);
    }
    if (document.getElementById('useTerracotta').checked) {
        palette.push(...ALL_BLOCKS.terracotta);
    }
    if (document.getElementById('useGlass').checked) {
        palette.push(...ALL_BLOCKS.glass);
    }
    
    if (palette.length === 0) {
        return ALL_BLOCKS.wool;
    }
    
    return palette;
}

const colorToBlock = {
    getBlock(r, g, b, a, palette) {
        // If transparent, return air
        if (a < 128) return { id: 0, data: 0 };
        
        // Otherwise find closest matching block
        let closestBlock = palette[0];
        let minDistance = Infinity;

        for (const block of palette) {
            const distance = Math.sqrt(
                Math.pow(r - block.rgb[0], 2) +
                Math.pow(g - block.rgb[1], 2) +
                Math.pow(b - block.rgb[2], 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestBlock = block;
            }
        }

        return { id: closestBlock.id, data: closestBlock.data };
    }
};

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
    }
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// Username fetch functionality
fetchBtn.addEventListener('click', fetchSkinFromUsername);

usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        fetchSkinFromUsername();
    }
});

async function fetchSkinFromUsername() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showStatus('Please enter a username', 'error');
        return;
    }

    fetchBtn.disabled = true;
    showStatus('Fetching skin from Minecraft servers...', 'success');

    try {
        // Use mc-heads.net API to get skin directly from username
        const skinUrl = `https://mc-heads.net/skin/${encodeURIComponent(username)}`;
        
        const response = await fetch(skinUrl);
        
        if (!response.ok) {
            throw new Error('Player not found or API unavailable');
        }

        const blob = await response.blob();
        const img = new Image();
        
        img.onload = () => {
            if ((img.width !== 64 || (img.height !== 64 && img.height !== 32))) {
                showStatus('Invalid skin format received', 'error');
                return;
            }
            
            skinImage = img;
            originalFilename = username;
            displayPreview(img);
            convertBtn.disabled = false;
            convertBtn.setAttribute('aria-disabled', 'false');
            showStatus(`Skin loaded for ${username}`, 'success');
        };
        
        img.onerror = () => {
            showStatus('Failed to load skin image', 'error');
        };
        
        img.src = URL.createObjectURL(blob);
        
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        fetchBtn.disabled = false;
    }
}

function handleFile(file) {
    if (!file.type.match('image/png')) {
        showStatus('Please upload a PNG file', 'error');
        return;
    }

    originalFilename = file.name.replace(/\.[^/.]+$/, '');

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            if ((img.width !== 64 || (img.height !== 64 && img.height !== 32))) {
                showStatus('Skin must be 64x64 or 64x32 pixels', 'error');
                return;
            }
            skinImage = img;
            displayPreview(img);
            convertBtn.disabled = false;
            convertBtn.setAttribute('aria-disabled', 'false');
            showStatus('', '');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayPreview(img) {
    const ctx = preview.getContext('2d');
    preview.width = img.width * 4;
    preview.height = img.height * 4;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, preview.width, preview.height);
    previewSection.classList.add('active');
}

function getSkinData(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
}

function getPixel(imageData, x, y) {
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    const idx = (y * imageData.width + x) * 4;
    return {
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2],
        a: imageData.data[idx + 3]
    };
}

function build3DStatue(imageData, scale, palette) {
    const voxels = new Map();
    const is64x64 = imageData.height === 64;
    
    // Part definitions with base and overlay UVs
    const parts = {
        head: {
            size: [8, 8, 8],
            pos: [4, 24, 4],
            base: {
                right: [16, 8, 24, 16],
                front: [8, 8, 16, 16],
                left: [0, 8, 8, 16],
                back: [24, 8, 32, 16],
                top: [8, 0, 16, 8],
                bottom: [16, 0, 24, 8]
            },
            overlay: is64x64 ? {
                right: [48, 8, 56, 16],
                front: [40, 8, 48, 16],
                left: [32, 8, 40, 16],
                back: [56, 8, 64, 16],
                top: [40, 0, 48, 8],
                bottom: [48, 0, 56, 8]
            } : null
        },
        body: {
            size: [8, 12, 4],
            pos: [4, 12, 6],
            base: {
                right: [16, 20, 20, 32],
                front: [20, 20, 28, 32],
                left: [28, 20, 32, 32],
                back: [32, 20, 40, 32],
                top: [20, 16, 28, 20],
                bottom: [28, 16, 36, 20]
            },
            overlay: is64x64 ? {
                right: [16, 36, 20, 48],
                front: [20, 36, 28, 48],
                left: [28, 36, 32, 48],
                back: [32, 36, 40, 48],
                top: [20, 32, 28, 36],
                bottom: [28, 32, 36, 36]
            } : null
        },
        rightArm: {
            size: [4, 12, 4],
            pos: [0, 12, 6],
            base: {
                right: [40, 20, 44, 32],
                front: [44, 20, 48, 32],
                left: [48, 20, 52, 32],
                back: [52, 20, 56, 32],
                top: [44, 16, 48, 20],
                bottom: [48, 16, 52, 20]
            },
            overlay: is64x64 ? {
                right: [40, 36, 44, 48],
                front: [44, 36, 48, 48],
                left: [48, 36, 52, 48],
                back: [52, 36, 56, 48],
                top: [44, 32, 48, 36],
                bottom: [48, 32, 52, 36]
            } : null
        },
        leftArm: {
            size: [4, 12, 4],
            pos: [12, 12, 6],
            base: is64x64 ? {
                right: [32, 52, 36, 64],
                front: [36, 52, 40, 64],
                left: [40, 52, 44, 64],
                back: [44, 52, 48, 64],
                top: [36, 48, 40, 52],
                bottom: [40, 48, 44, 52]
            } : {
                right: [40, 20, 44, 32],
                front: [44, 20, 48, 32],
                left: [48, 20, 52, 32],
                back: [52, 20, 56, 32],
                top: [44, 16, 48, 20],
                bottom: [48, 16, 52, 20]
            },
            overlay: is64x64 ? {
                right: [48, 52, 52, 64],
                front: [52, 52, 56, 64],
                left: [56, 52, 60, 64],
                back: [60, 52, 64, 64],
                top: [52, 48, 56, 52],
                bottom: [56, 48, 60, 52]
            } : null
        },
        rightLeg: {
            size: [4, 12, 4],
            pos: [4, 0, 6],
            base: {
                right: [0, 20, 4, 32],
                front: [4, 20, 8, 32],
                left: [8, 20, 12, 32],
                back: [12, 20, 16, 32],
                top: [4, 16, 8, 20],
                bottom: [8, 16, 12, 20]
            },
            overlay: is64x64 ? {
                right: [0, 36, 4, 48],
                front: [4, 36, 8, 48],
                left: [8, 36, 12, 48],
                back: [12, 36, 16, 48],
                top: [4, 32, 8, 36],
                bottom: [8, 32, 12, 36]
            } : null
        },
        leftLeg: {
            size: [4, 12, 4],
            pos: [8, 0, 6],
            base: is64x64 ? {
                right: [16, 52, 20, 64],
                front: [20, 52, 24, 64],
                left: [24, 52, 28, 64],
                back: [28, 52, 32, 64],
                top: [20, 48, 24, 52],
                bottom: [24, 48, 28, 52]
            } : {
                right: [0, 20, 4, 32],
                front: [4, 20, 8, 32],
                left: [8, 20, 12, 32],
                back: [12, 20, 16, 32],
                top: [4, 16, 8, 20],
                bottom: [8, 16, 12, 20]
            },
            overlay: is64x64 ? {
                right: [0, 52, 4, 64],
                front: [4, 52, 8, 64],
                left: [8, 52, 12, 64],
                back: [12, 52, 16, 64],
                top: [4, 48, 8, 52],
                bottom: [8, 48, 12, 52]
            } : null
        }
    };

    function setVoxel(x, y, z, block) {
        voxels.set(`${x},${y},${z}`, block);
    }

    function getUV(face, x, y, z, width, height, depth) {
        const faceMap = {
            right: () => [z, height - 1 - y],
            left: () => [depth - 1 - z, height - 1 - y],
            front: () => [x, height - 1 - y],
            back: () => [width - 1 - x, height - 1 - y],
            top: () => [x, z],
            bottom: () => [x, depth - 1 - z]
        };
        return faceMap[face]();
    }

    function buildLayer(part, uvMap, offsetX, offsetY, offsetZ, expandSize) {
        const [width, height, depth] = part.size;
        const [startX, startY, startZ] = part.pos;
        
        // Expand size for overlay layers
        const actualWidth = width + expandSize * 2;
        const actualHeight = height + expandSize * 2;
        const actualDepth = depth + expandSize * 2;

        for (let y = 0; y < actualHeight; y++) {
            for (let z = 0; z < actualDepth; z++) {
                for (let x = 0; x < actualWidth; x++) {
                    // Always build only outer shell (even for base layer)
                    const isOuterShell = x === 0 || x === actualWidth - 1 ||
                                         y === 0 || y === actualHeight - 1 ||
                                         z === 0 || z === actualDepth - 1;
                    if (!isOuterShell) continue;
                    
                    let face;
                    const localX = x - expandSize;
                    const localY = y - expandSize;
                    const localZ = z - expandSize;
                    
                    // Determine which face this voxel is on (prioritize front/back over sides)
                    if (z === 0) face = 'front';
                    else if (z === actualDepth - 1) face = 'back';
                    else if (y === actualHeight - 1) face = 'top';
                    else if (y === 0) face = 'bottom';
                    else if (x === 0) face = 'right';
                    else if (x === actualWidth - 1) face = 'left';
                    else face = 'front'; // Fallback
                    
                    // Get UV coordinates (clamped to original size)
                    const uvX = Math.max(0, Math.min(width - 1, localX));
                    const uvY = Math.max(0, Math.min(height - 1, localY));
                    const uvZ = Math.max(0, Math.min(depth - 1, localZ));
                    
                    const [u, v] = getUV(face, uvX, uvY, uvZ, width, height, depth);
                    const faceUV = uvMap[face];
                    const pixel = getPixel(imageData, faceUV[0] + u, faceUV[1] + v);
                    
                    const block = colorToBlock.getBlock(pixel.r, pixel.g, pixel.b, pixel.a, palette);
                    
                    if (block.id !== 0) {
                        setVoxel(
                            startX + x + offsetX - expandSize,
                            startY + y + offsetY - expandSize,
                            startZ + z + offsetZ - expandSize,
                            block
                        );
                    }
                }
            }
        }
    }

    // Build each part
    for (const [partName, part] of Object.entries(parts)) {
        // Build base layer
        buildLayer(part, part.base, 0, 0, 0, 0);
        
        // Build overlay layer if exists and option is enabled
        const useOuterLayer = document.getElementById('useOuterLayer').checked;
        if (part.overlay && useOuterLayer) {
            buildLayer(part, part.overlay, 0, 0, 0, 1);
        }
    }

    return voxels;
}

class NBTWriter {
    constructor() {
        this.buffer = [];
    }

    writeByte(value) {
        this.buffer.push(value & 0xFF);
    }

    writeShort(value) {
        this.buffer.push((value >> 8) & 0xFF);
        this.buffer.push(value & 0xFF);
    }

    writeInt(value) {
        this.buffer.push((value >> 24) & 0xFF);
        this.buffer.push((value >> 16) & 0xFF);
        this.buffer.push((value >> 8) & 0xFF);
        this.buffer.push(value & 0xFF);
    }

    writeString(str) {
        const bytes = new TextEncoder().encode(str);
        this.writeShort(bytes.length);
        for (const byte of bytes) {
            this.buffer.push(byte);
        }
    }

    writeByteArray(arr) {
        this.writeInt(arr.length);
        for (const byte of arr) {
            this.buffer.push(byte & 0xFF);
        }
    }

    startCompound(name = null) {
        this.writeByte(10);
        if (name !== null) this.writeString(name);
    }

    endCompound() {
        this.writeByte(0);
    }

    writeTag(type, name, value) {
        this.writeByte(type);
        this.writeString(name);
        
        switch(type) {
            case 2:
                this.writeShort(value);
                break;
            case 7:
                this.writeByteArray(value);
                break;
            case 8:
                this.writeString(value);
                break;
        }
    }

    getBuffer() {
        return new Uint8Array(this.buffer);
    }
}

function createSchematic(voxels, scale) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (const key of voxels.keys()) {
        const [x, y, z] = key.split(',').map(Number);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    }

    const sizeX = (maxX - minX + 1) * scale;
    const sizeY = (maxY - minY + 1) * scale;
    const sizeZ = (maxZ - minZ + 1) * scale;

    const writer = new NBTWriter();
    
    writer.startCompound("Schematic");
    writer.writeTag(2, "Width", sizeX);
    writer.writeTag(2, "Height", sizeY);
    writer.writeTag(2, "Length", sizeZ);
    writer.writeTag(8, "Materials", "Alpha");
    
    const totalBlocks = sizeX * sizeY * sizeZ;
    const blocks = new Array(totalBlocks).fill(0);
    const blockData = new Array(totalBlocks).fill(0);
    
    for (const [key, block] of voxels.entries()) {
        const [x, y, z] = key.split(',').map(Number);
        const relX = x - minX;
        const relY = y - minY;
        const relZ = z - minZ;

        for (let sy = 0; sy < scale; sy++) {
            for (let sz = 0; sz < scale; sz++) {
                for (let sx = 0; sx < scale; sx++) {
                    const blockX = relX * scale + sx;
                    const blockY = relY * scale + sy;
                    const blockZ = relZ * scale + sz;
                    const blockIndex = (blockY * sizeZ + blockZ) * sizeX + blockX;
                    blocks[blockIndex] = block.id;
                    blockData[blockIndex] = block.data;
                }
            }
        }
    }
    
    writer.writeTag(7, "Blocks", blocks);
    writer.writeTag(7, "Data", blockData);
    
    writer.writeByte(9);
    writer.writeString("Entities");
    writer.writeByte(10);
    writer.writeInt(0);
    
    writer.writeByte(9);
    writer.writeString("TileEntities");
    writer.writeByte(10);
    writer.writeInt(0);
    
    writer.endCompound();
    
    return writer.getBuffer();
}

convertBtn.addEventListener('click', async () => {
    if (!skinImage) return;
    
    const palette = getActivePalette();
    const blockTypes = [];
    if (document.getElementById('useConcrete').checked) blockTypes.push('Concrete');
    if (document.getElementById('useWool').checked) blockTypes.push('Wool');
    if (document.getElementById('useTerracotta').checked) blockTypes.push('Terracotta');
    if (document.getElementById('useGlass').checked) blockTypes.push('Glass');
    
    const useOuterLayer = document.getElementById('useOuterLayer').checked;
    const layerText = useOuterLayer ? ' with outer layer' : '';
    
    convertBtn.disabled = true;
    convertBtn.setAttribute('aria-disabled', 'true');
    showStatus(`Converting statue${layerText}...`, 'success');
    
    try {
        const imageData = getSkinData(skinImage);
        const scale = parseInt(scaleInput.value);
        
        const voxels = build3DStatue(imageData, 1, palette);
        const schematicData = createSchematic(voxels, scale);
        const compressed = pako.gzip(schematicData);
        
        const blob = new Blob([compressed], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalFilename}.schematic`;
        a.click();
        URL.revokeObjectURL(url);
        
        showStatus(`${originalFilename}.schematic created successfully`, 'success');
    } catch (error) {
        showStatus('Error: ' + error.message, 'error');
        console.error(error);
    } finally {
        convertBtn.disabled = false;
        convertBtn.setAttribute('aria-disabled', 'false');
    }
});

function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
}
