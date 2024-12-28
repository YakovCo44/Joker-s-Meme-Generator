document.addEventListener('DOMContentLoaded', () => {
    const galleryBtn = document.getElementById('galleryBtn')
    const aboutBtn = document.getElementById('aboutBtn')
    const content = document.getElementById('content')

    const savedMemes = []
    localStorage.setItem('savedMemes', JSON.stringify(savedMemes))

    let selectedTextIndex = -1
    let isDragging = false

    const images = [
        'img/1h3ebt.jpg',
        'img/1kc7jq.jpg',
        'img/1m6lk1.jpg',
        'img/2eomlo.jpg',        
        'img/2rqf0o.jpg',
        'img/3nx72a.jpg',
        'img/3pid77.jpg',
        'img/4esscx.jpg',
        'img/4qjj6i.jpg',
        'img/5djfv.jpg',
        'img/6q75zl.jpg',
        'img/6y0wkp.jpg',
        'img/6yzukk.jpg',
        'img/7gvov4.jpg',
        'img/7k0j5y.jpg',
        'img/8jtmur.jpg',
        'img/11gbgy.jpg',
        'img/11zznd.jpg',
        'img/17hfk7.jpg',
        'img/18k18g.jpg',
        'img/19e5ss.jpg',
        'img/27hn2y.jpg',
        'img/28d06m.jpg',
        'img/28z15i.jpg',
        'img/46hn8i.jpg',
        'img/55on14.jpg',
        'img/719i6p.jpg',
        'img/790xr.jpg',
        'img/1476d.jpg',
        'img/1848ri.jpg',
        'img/66277d.jpg',
        'img/aevrw.jpg',
        'img/biy0x.jpg',
        'img/csqe4.jpg',
        'img/hz15h.jpg',
        'img/im-tired-of-pretending-its-not-meme-template-thumbnail-30804ba4.jpg',
        'img/j4h55.jpg',
        'img/life-is-good-but-it-can-be-better.jpg',
        'img/po7py.jpg',
        'img/Two-Buttons.jpg',
        'img/very-poor-choice-of-words.jpg',
        'img/xS80POlg.jpg',
        'img/ykiuo.jpg',
        'img/da6kc.jpg',
        'img/5r0gun.jpg',
        'img/1cq3yn.jpg',
        'img/fwg9u.jpg',
        'img/52zhla.jpg',
        'img/7ndgqg.jpg',
    ]

    function loadGallery() {
        content.innerHTML = `
            <h1 class="title">Gallery</h1>
            <div id="gallery" class="gallery"></div>
        `
        const gallery = document.getElementById('gallery')
    
        const uploadDiv = document.createElement('div')
        uploadDiv.className = 'upload-image-container'
        uploadDiv.innerHTML = `
             <label for="uploadImageInput" class="upload-label">
                  <div class="upload-placeholder">Think you are crazier than I am?</div>
            </label>
             <input type="file" id="uploadImageInput" class="upload-input" accept="image/*" style="display:none">
            `
        gallery.appendChild(uploadDiv)

        const uploadInput = document.getElementById('uploadImageInput')
        uploadInput.addEventListener('change', handleImageUpload)

        images.forEach(imgName => {
          const img = document.createElement('img')
          img.src = `${imgName}`
          img.alt = 'Joker Meme'
          img.className = 'gallery-img'
          img.addEventListener('click', () => loadEditor(`${imgName}`))
          gallery.appendChild(img)
        })

    
        const aboutBtn = document.getElementById('aboutBtn')
        if (aboutBtn) {
            aboutBtn.addEventListener('click', openAboutModal)
        }
    }

    function handleImageUpload(event) {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const uploadedImageUrl = reader.result
    
                const img = document.createElement('img')
                img.src = uploadedImageUrl
                img.alt = 'Uploaded Meme'
                img.className = 'gallery-img'
                img.addEventListener('click', () => loadEditor(uploadedImageUrl))
    
                const gallery = document.getElementById('gallery')
                gallery.insertBefore(img, gallery.children[1])
            }
            reader.readAsDataURL(file)
        }
    }

    function shareToFacebook() {
        const canvas = document.getElementById('memeCanvas')
        const dataUrl = canvas.toDataURL('image/png')
    
        fetch(dataUrl)
            .then(response => response.blob())
            .then(blob => {
                const formData = new FormData()
                formData.append('file', blob)
                formData.append('upload_preset', 'unsigned_upload')
    
                return fetch(`https://api.cloudinary.com/v1_1/dpuyrzrdd/image/upload`, {
                    method: 'POST',
                    body: formData,
                })
            })
            .then(response => response.json())
            .then(uploadResult => {
                const publicUrl = uploadResult.secure_url
                console.log('Uploaded Image URL:', publicUrl)
    
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`
                console.log('Facebook Sharing URL:', facebookUrl)
    
                window.open(facebookUrl, '_blank')
            })
            .catch(error => {
                console.error('Error sharing to Facebook:', error)
                alert('Failed to share. Please try again.')
            })
    }
      
    function loadEditor(selectedImage) {
        content.innerHTML = `
            <h1 class="title">Meme Editor</h1>
            <div class="editor">
                <div class="canvas-container">
                    <canvas id="memeCanvas"></canvas>
                </div>
                <div class="controls">
                    <button id="addTextBlockBtn">Add Text Block</button>
                    <input type="text" id="memeText" placeholder="Enter text">
                    <input type="color" id="textColor" value="#ffffff">
                    <select id="fontStyle">
                     <option value="Arial">Arial</option>
                     <option value="Courier New">Courier New</option>
                     <option value="Impact">Impact</option>
                     <option value="Comic Sans MS">Comic Sans MS</option>
                     <option value="Times New Roman">Times New Roman</option>
                    </select>
                        <input type="number" id="fontSize" placeholder="Font Size" value="30">
                         <button id="boldBtn">Bold</button>
                            <button id="italicBtn">Italic</button>
                            <button id="deleteBtn">Delete Text</button>
                            <button id="resetBtn">Reset</button>
                            <button id="saveBtn">Save Meme</button>
                            <button id="downloadBtn">Download Meme</button>
                            <button id="shareFacebookBtn" class="facebook-share-btn">
                                <img src ="img/facebook-logo.png" alt="Facebook Logo" class="facebook-logo">
                                Share to Facebook
                            </button>
                </div>
            </div>
            <button id="backToGalleryBtn">Back to Gallery</button>
        `
    
        const canvas = document.getElementById('memeCanvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = selectedImage
    
        let isDragging = false
        let textBlocks = []
        let selectedTextIndex = -1
    
        img.onload = () => {
            const maxCanvasWidth = window.innerWidth * 0.9
            const maxCanvasHeight = window.innerHeight * 0.9
        
            const imgAspectRatio = img.width / img.height
            const canvasAspectRatio = maxCanvasWidth / maxCanvasHeight
        
            const isMobile = window.innerWidth <= 480
            const isTablet = window.innerWidth > 480 && window.innerWidth <= 1024
            
            if (isMobile) {
                canvas.width = maxCanvasWidth * 0.9 
                canvas.height = canvas.width / imgAspectRatio
            } else if (isTablet) {
                canvas.width = maxCanvasWidth * 0.8 
                canvas.height = canvas.width / imgAspectRatio
            } else {
                if (imgAspectRatio > canvasAspectRatio) {
                    canvas.width = maxCanvasWidth
                    canvas.height = maxCanvasWidth / imgAspectRatio
                } else {
                    canvas.height = maxCanvasHeight
                    canvas.width = maxCanvasHeight * imgAspectRatio
                }
            }            
            
            drawCanvas()
        }
        
        function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        
            if (img.complete && img.naturalHeight !== 0) {
                const imgAspectRatio = img.width / img.height
                const canvasAspectRatio = canvas.width / canvas.height
        
                if (imgAspectRatio > canvasAspectRatio) {
                    const scaledHeight = canvas.height
                    const scaledWidth = (img.width * canvas.height) / img.height
                    ctx.drawImage(img, (canvas.width - scaledWidth) / 2, 0, scaledWidth, scaledHeight)
                } else {
                    const scaledWidth = canvas.width
                    const scaledHeight = (img.height * canvas.width) / img.width
                    ctx.drawImage(img, 0, (canvas.height - scaledHeight) / 2, scaledWidth, scaledHeight)
                }
            }
        
            textBlocks.forEach((block, index) => {
                ctx.fillStyle = block.color
                ctx.font = block.font
                ctx.fillText(block.text, block.x, block.y)
        
                if (index === selectedTextIndex) {
                    const textWidth = ctx.measureText(block.text).width
                    ctx.strokeStyle = '#ff0000'
                    ctx.strokeRect(block.x - 5, block.y - 25, textWidth + 10, 30)
                }
        
                console.log('drawCanvas:', { text: block.text, x: block.x, y: block.y, index })
            })
        }        

        document.getElementById('memeText').addEventListener('input', () => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].text = document.getElementById('memeText').value
                drawCanvas()
            }
        })
        
        document.getElementById('textColor').addEventListener('input', () => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].color = document.getElementById('textColor').value
                drawCanvas()
            }
        })

        document.getElementById('backToGalleryBtn').addEventListener('click', loadGallery)
        document.getElementById('aboutBtn').addEventListener('click', openAboutModal)
        document.getElementById('downloadBtn').addEventListener('click', downloadMeme)
        document.getElementById('shareFacebookBtn').addEventListener('click', shareToFacebook)
    
        document.getElementById('addTextBlockBtn').addEventListener('click', () => {
            addTextBlock('New Text', 50, 50)
            document.getElementById('memeText').value = 'New Text'
            document.getElementById('textColor').value = '#ffffff'
        })

        document.getElementById('fontSize').addEventListener('input', (e) => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].font = `${e.target.value}px Arial` 
                drawCanvas()
            }
        })

        document.getElementById('fontStyle').addEventListener('change', (e) => {
            if (selectedTextIndex >= 0) {
                const fontSize = textBlocks[selectedTextIndex].font.split(' ')[0] 
                textBlocks[selectedTextIndex].font = `${fontSize} ${e.target.value}`
                drawCanvas()
            }
        })
        
        document.getElementById('boldBtn').addEventListener('click', () => {
            if (selectedTextIndex >= 0) {
                const fontParts = textBlocks[selectedTextIndex].font.split(' ')
                if (!fontParts.includes('bold')) fontParts.unshift('bold')
                else fontParts.splice(fontParts.indexOf('bold'), 1)
                textBlocks[selectedTextIndex].font = fontParts.join(' ')
                drawCanvas()
            }
        })
        
        document.getElementById('italicBtn').addEventListener('click', () => {
            if (selectedTextIndex >= 0) {
                const fontParts = textBlocks[selectedTextIndex].font.split(' ')
                if (!fontParts.includes('italic')) fontParts.unshift('italic')
                else fontParts.splice(fontParts.indexOf('italic'), 1)
                textBlocks[selectedTextIndex].font = fontParts.join(' ')
                drawCanvas()
            }
        })
        
        document.getElementById('deleteBtn').addEventListener('click', () => {
            if (selectedTextIndex >= 0) {
                textBlocks.splice(selectedTextIndex, 1) 
                selectedTextIndex = -1 
                drawCanvas()
            }
        })
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            textBlocks = [] 
            selectedTextIndex = -1 
            drawCanvas()
        })
        
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect()
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)
        
            selectedTextIndex = textBlocks.findIndex((block, index) => {
                const textWidth = ctx.measureText(block.text).width
                const textHeight = parseInt(block.font, 10) 
                const padding = 5
                const isInsideBlock = (
                    mouseX >= block.x - padding &&
                    mouseX <= block.x + textWidth + padding &&
                    mouseY >= block.y - textHeight - padding &&
                    mouseY <= block.y + padding
                )
                console.log(`Checking Block ${index}:`, { isInsideBlock })
                return isInsideBlock
            })
        
            console.log('Selected Text Index:', selectedTextIndex)
        
            if (selectedTextIndex >= 0) {
                isDragging = true
                const selectedBlock = textBlocks[selectedTextIndex]
                console.log('Selected Block:', selectedBlock)
        
                document.getElementById('memeText').value = selectedBlock.text
                document.getElementById('textColor').value = selectedBlock.color
                document.getElementById('fontSize').value = parseInt(selectedBlock.font, 10)
                const fontParts = selectedBlock.font.split(' ')
                document.getElementById('fontStyle').value = fontParts[fontParts.length - 1]
            } else {
                console.log('No block selected')
                selectedTextIndex = -1
            }
        
            drawCanvas()
        })                      
        
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging && selectedTextIndex >= 0) {
                const block = textBlocks[selectedTextIndex]
                block.x = e.offsetX
                block.y = e.offsetY
        
                console.log('mousemove:', { x: block.x, y: block.y, text: block.text })
                drawCanvas()
            }
        })        
        
        canvas.addEventListener('mouseup', () => {
            if (isDragging) {
                console.log('mouseup: Stopped dragging')
                isDragging = false
            }
        })  

        canvas.addEventListener('touchstart', handlePointerStart)
        canvas.addEventListener('touchmove', handlePointerMove)
        canvas.addEventListener('touchend', handlePointerEnd)

        document.getElementById('saveBtn').addEventListener('click', () => {
            const memeData = {
                image: canvas.toDataURL('image/png'), 
                textBlocks: [...textBlocks], 
                canvasWidth: canvas.width, 
                canvasHeight: canvas.height
            }
    
            const savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || []
            savedMemes.push(memeData);
            localStorage.setItem('savedMemes', JSON.stringify(savedMemes))
        
            showModal('Meme saved successfully!')
        })
    
        function addTextBlock(text = '', x = 50, y = 50, color = '#ffffff', font = '30px Arial') {
            textBlocks.push({ text, x, y, color, font })
            selectedTextIndex = textBlocks.length - 1
            drawCanvas()
        }
    }

    function downloadMeme() {
        const canvas = document.getElementById('memeCanvas') 
        const link = document.createElement('a') 
        link.download = 'meme.png' 
        link.href = canvas.toDataURL('image/png') 
        link.click() 
    }

    function shareToFacebook() {
        const canvas = document.getElementById('memeCanvas')
        const dataUrl = canvas.toDataURL('image/png') 
    
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dataUrl)}`
        window.open(facebookUrl, '_blank')
    }    

    function showModal(message) {
        const modal = document.createElement('div')
        modal.className = 'save-modal'
        modal.innerHTML = `
            <div class="modal-content">
                <p>${message}</p>
            </div>
        `
        document.body.appendChild(modal)
    
        setTimeout(() => {
            modal.remove()
        }, 2000)
    }

    function handlePointerStart(event) {
    const rect = canvas.getBoundingClientRect()
    const pointerX = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left
    const pointerY = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top

    const mouseX = pointerX * (canvas.width / rect.width)
    const mouseY = pointerY * (canvas.height / rect.height)

    console.log('Pointer Start Position:', { mouseX, mouseY })

    selectedTextIndex = textBlocks.findIndex(block => {
        const textWidth = ctx.measureText(block.text).width
        const textHeight = parseInt(block.font, 10)
        return (
            mouseX >= block.x - 5 &&
            mouseX <= block.x + textWidth + 5 &&
            mouseY >= block.y - textHeight - 5 &&
            mouseY <= block.y + 5
        )
    })

    if (selectedTextIndex >= 0) {
        isDragging = true
        console.log('Dragging Started:', textBlocks[selectedTextIndex])
    } else {
        console.log('No block selected')
    }

    drawCanvas()
}
    
function handlePointerMove(event) {
    if (isDragging && selectedTextIndex >= 0) {
        const rect = canvas.getBoundingClientRect()
        const pointerX = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left
        const pointerY = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top

        const mouseX = pointerX * (canvas.width / rect.width)
        const mouseY = pointerY * (canvas.height / rect.height)

        textBlocks[selectedTextIndex].x = mouseX
        textBlocks[selectedTextIndex].y = mouseY

        console.log('Moved Block:', textBlocks[selectedTextIndex])

        drawCanvas()
        event.preventDefault() 
    }
}

function handlePointerEnd() {
    if (isDragging) {
        console.log('Stopped dragging:', textBlocks[selectedTextIndex])
        isDragging = false
    }
}

function openAboutModal() {
    const modal = document.createElement('div')
    modal.className = 'modal'

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h1 class="title">If you want to know more...</h1>
            <p>HA HA HA! This is a Joker-themed meme generator. Select a template and start making fun of Batsy and his Super-Friends!</p>
        </div>
    `
    document.body.appendChild(modal)

    modal.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const closeBtn = modal.querySelector('.close-btn')
    closeBtn.addEventListener('click', () => {
        modal.remove()
    })
}

function addTextBlock(text = '', x = 50, y = 50, color = '#ffffff', font = '30px Arial') {
    textBlocks.push({ text, x, y, color, font })
    selectedTextIndex = textBlocks.length - 1 
    drawCanvas()
}
    
document.getElementById('savedBtn').addEventListener('click', () => {
    content.innerHTML = `
        <h1 class="title">Saved Memes</h1>
        <div id="savedGallery" class="gallery"></div>
    `

    const savedGallery = document.getElementById('savedGallery')
    const savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || []

    savedMemes.forEach((meme, index) => {
        const memeContainer = document.createElement('div')
        memeContainer.className = 'meme-container'

        const img = document.createElement('img')
        img.src = meme.image
        img.alt = `Meme ${index + 1}`
        img.className = 'gallery-img'

        const reEditBtn = document.createElement('button')
        reEditBtn.textContent = 'Re-Edit'
        reEditBtn.className = 're-edit-btn'
        reEditBtn.addEventListener('click', () => loadEditorForReEdit(meme))

        memeContainer.appendChild(img)
        memeContainer.appendChild(reEditBtn)
        savedGallery.appendChild(memeContainer)
    })

    const aboutBtn = document.getElementById('aboutBtn')
    if (aboutBtn) aboutBtn.addEventListener('click', openAboutModal)
})

function loadEditorForReEdit(meme) {
    content.innerHTML = `
        <h1 class="title">Meme Editor</h1>
        <div class="editor">
            <div class="canvas-container">
                <canvas id="memeCanvas"></canvas>
            </div>
            <div class="controls">
                <button id="addTextBlockBtn">Add Text Block</button>
                <input type="text" id="memeText" placeholder="Enter text">
                <input type="color" id="textColor" value="#ffffff">
                <select id="fontStyle">
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Times New Roman">Times New Roman</option>
                </select>
                <input type="number" id="fontSize" placeholder="Font Size" value="30">
                <button id="boldBtn">Bold</button>
                <button id="italicBtn">Italic</button>
                <button id="deleteBtn">Delete Text</button>
                <button id="resetBtn">Reset</button>
                <button id="saveBtn">Save Meme</button>
            </div>
        </div>
        <button id="backToGalleryBtn">Back to Gallery</button>
    `

    const canvas = document.getElementById('memeCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = meme.canvasWidth
    canvas.height = meme.canvasHeight

    const img = new Image()
    img.src = meme.image
    let isDragging = false
    let selectedTextIndex = -1

    textBlocks = meme.textBlocks.map(block => ({
        text: block.text || '',
        x: block.x * (canvas.width / meme.canvasWidth),
        y: block.y * (canvas.height / meme.canvasHeight),
        font: block.font || '30px Arial',
        color: block.color || '#ffffff',
    }))
    
    console.log('Restored Text Blocks (Normalized):', textBlocks)
        
    textBlocks.forEach(block => {
    block.x = block.x * (canvas.width / meme.canvasWidth)
    block.y = block.y * (canvas.height / meme.canvasHeight)
    })

    img.onload = () => {
        drawCanvas()
    }

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        if (img.complete && img.naturalHeight !== 0) {
            const imgAspectRatio = img.width / img.height
            const canvasAspectRatio = canvas.width / canvas.height
    
            if (imgAspectRatio > canvasAspectRatio) {
                const scaledHeight = canvas.height
                const scaledWidth = (img.width * canvas.height) / img.height
                ctx.drawImage(img, (canvas.width - scaledWidth) / 2, 0, scaledWidth, scaledHeight)
            } else {
                const scaledWidth = canvas.width
                const scaledHeight = (img.height * canvas.width) / img.width
                ctx.drawImage(img, 0, (canvas.height - scaledHeight) / 2, scaledWidth, scaledHeight)
            }
        }
    
        textBlocks.forEach((block, index) => {
            ctx.fillStyle = block.color
            ctx.font = block.font
            ctx.fillText(block.text, block.x, block.y)
    
            if (index === selectedTextIndex) {
                const textWidth = ctx.measureText(block.text).width
                ctx.strokeStyle = '#ff0000'
                ctx.strokeRect(block.x - 5, block.y - 25, textWidth + 10, 30)
            }
        })
    }       

    function addTextBlock(text = '', x = 50, y = 50, color = '#ffffff', font = '30px Arial') {
        textBlocks.push({ text, x, y, color, font })
        selectedTextIndex = textBlocks.length - 1
        drawCanvas()
    }

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect()
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)
    
        console.log('Mouse Position:', { mouseX, mouseY })
    
        textBlocks.forEach((block, index) => {
            const textWidth = ctx.measureText(block.text).width
            const textHeight = parseInt(block.font, 10)
            const isInsideBlock = (
                mouseX >= block.x - 5 &&
                mouseX <= block.x + textWidth + 5 &&
                mouseY >= block.y - textHeight - 5 &&
                mouseY <= block.y + 5
            )
    
            console.log(`Block ${index}:`, {
                x: block.x,
                y: block.y,
                textWidth,
                textHeight,
                isInsideBlock,
            })
        })
    
        selectedTextIndex = textBlocks.findIndex(block => {
            const textWidth = ctx.measureText(block.text).width
            const textHeight = parseInt(block.font, 10)
            return (
                mouseX >= block.x - 5 &&
                mouseX <= block.x + textWidth + 5 &&
                mouseY >= block.y - textHeight - 5 &&
                mouseY <= block.y + 5
            )
        })
    
        console.log('Selected Text Index:', selectedTextIndex)
    
        if (selectedTextIndex >= 0) {
            const selectedBlock = textBlocks[selectedTextIndex]
            console.log('Selected Block:', selectedBlock)
    
            document.getElementById('memeText').value = selectedBlock.text
            document.getElementById('textColor').value = selectedBlock.color
            document.getElementById('fontSize').value = parseInt(selectedBlock.font, 10)
            const fontParts = selectedBlock.font.split(' ')
            document.getElementById('fontStyle').value = fontParts[fontParts.length - 1]
    
            isDragging = true
        } else {
            console.log('No block selected')
            selectedTextIndex = -1
            isDragging = false
        }
    
        drawCanvas()
    })    
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && selectedTextIndex >= 0) {
            const rect = canvas.getBoundingClientRect()
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)
    
            textBlocks[selectedTextIndex].x = mouseX
            textBlocks[selectedTextIndex].y = mouseY
    
            console.log('Moved Block:', textBlocks[selectedTextIndex])
    
            drawCanvas()
        }
    })
        
    
    canvas.addEventListener('mouseup', () => {
        if (isDragging) {
            console.log('Stopped dragging:', textBlocks[selectedTextIndex])
            isDragging = false
        }
    })                

    attachEditorEventListeners(drawCanvas, addTextBlock)

    document.getElementById('backToGalleryBtn').addEventListener('click', loadGallery)
}

function attachEditorEventListeners(drawCanvas, addTextBlock) {
    document.getElementById('memeText').addEventListener('input', () => {
        if (selectedTextIndex >= 0) {
            textBlocks[selectedTextIndex].text = document.getElementById('memeText').value
            console.log('Updated Text:', textBlocks[selectedTextIndex])
            drawCanvas()
        } else {
            console.log('No block selected for text update')
        }
    })

    document.getElementById('textColor').addEventListener('input', () => {
        if (selectedTextIndex >= 0) {
            textBlocks[selectedTextIndex].color = document.getElementById('textColor').value
            console.log('Updated Color:', textBlocks[selectedTextIndex])
            drawCanvas()
        } else {
            console.log('No block selected for color update')
        }
    })

    document.getElementById('fontSize').addEventListener('input', (e) => {
        if (selectedTextIndex >= 0) {
            const fontSize = e.target.value
            const fontParts = textBlocks[selectedTextIndex].font.split(' ')
            const fontStyle = fontParts.slice(1).join(' ')
            textBlocks[selectedTextIndex].font = `${fontSize}px ${fontStyle}`
            console.log('Updated Font Size:', textBlocks[selectedTextIndex])
            drawCanvas()
        } else {
            console.log('No block selected for font size update')
        }
    })

    document.getElementById('fontStyle').addEventListener('change', (e) => {
        if (selectedTextIndex >= 0) {
            const fontStyle = e.target.value
            const fontParts = textBlocks[selectedTextIndex].font.split(' ')
            const fontSize = fontParts[0]
            textBlocks[selectedTextIndex].font = `${fontSize} ${fontStyle}`
            console.log('Updated Font Style:', textBlocks[selectedTextIndex])
            drawCanvas()
        } else {
            console.log('No block selected for font style update')
        }
    })
}

function createFloatingText() {
    for (let i = 0; i < 10; i++) {
        const haha = document.createElement('div')
        haha.className = 'haha'
        haha.innerText = 'HAHAHA'
        haha.style.position = 'absolute'
        haha.style.top = `${Math.random() * window.innerHeight}px`
        haha.style.left = `${Math.random() * window.innerWidth}px`
        haha.style.fontSize = `${Math.random() * 30 + 20}px`
        haha.style.zIndex = '1000'
        document.body.appendChild(haha)

        setTimeout(() => haha.remove(), 3000)
    }
}

document.getElementById('crazyBtn').addEventListener('click', () => {
    const flashOverlay = document.getElementById('flash-overlay')

    flashOverlay.classList.add('flash')

    const laughSound = new Audio('audio/joker-laugh.mp3')
    laughSound.play()

    document.body.classList.add('shake')
    setTimeout(() => {
        document.body.classList.remove('shake')
    }, 2000)

    createFloatingText()

    const content = document.getElementById('content')
    content.innerHTML = `
        <div class="spinner">
            <p>Getting Crazy...</p>
        </div>
    `
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * images.length)
        const randomImage = images[randomIndex]
        loadEditor(randomImage)
    }, 4000)
})

galleryBtn.addEventListener('click', () => {
    textBlocks = [] 
    selectedTextIndex = -1
    loadGallery()
})

    loadGallery()
})






