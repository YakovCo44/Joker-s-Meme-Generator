document.addEventListener('DOMContentLoaded', () => {
    const galleryBtn = document.getElementById('galleryBtn')
    const aboutBtn = document.getElementById('aboutBtn')
    const content = document.getElementById('content')

    const savedMemes = []
    localStorage.setItem('savedMemes', JSON.stringify(savedMemes))

    let textBlocks = []
    let selectedTextIndex = -1

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
    ]

    function loadGallery() {
        content.innerHTML = `
            <h1 class="title">Gallery</h1>
            <div id="gallery" class="gallery"></div>
        `
        const gallery = document.getElementById('gallery')
    
        images.forEach(imgName => {
            const img = document.createElement('img')
            img.src = `${imgName}`
            img.alt = 'Joker Meme'
            img.className = 'gallery-img'
            img.addEventListener('click', () => loadEditor(`${imgName}`))
            gallery.appendChild(img)
        })
    
        // Reattach the About button listener
        const aboutBtn = document.getElementById('aboutBtn')
        if (aboutBtn) {
            aboutBtn.addEventListener('click', openAboutModal)
        }
    }
    

    function loadEditor(selectedImage) {
        content.innerHTML = `
            <h1 class="title">Meme Editor</h1>
            <div class="editor">
                <div class="canvas-container">
                    <canvas id="memeCanvas"></canvas>
                </div>
                <div class="controls">
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
                            <button id="addTextBlockBtn">Add Text Block</button>
                            <button id="saveBtn">Save Meme</button>
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
            canvas.width = img.width
            canvas.height = img.height
            drawCanvas()
        }
    
        function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
    
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
    
        document.getElementById('memeText').addEventListener('input', () => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].text = document.getElementById('memeText').value
                drawCanvas()
            }
        })
        
        // Allow color updates for selected text block
        document.getElementById('textColor').addEventListener('input', () => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].color = document.getElementById('textColor').value
                drawCanvas()
            }
        })

        document.getElementById('backToGalleryBtn').addEventListener('click', loadGallery)
        document.getElementById('aboutBtn').addEventListener('click', openAboutModal)
    
        document.getElementById('addTextBlockBtn').addEventListener('click', () => {
            addTextBlock('New Text', 50, 50)
            document.getElementById('memeText').value = 'New Text'
            document.getElementById('textColor').value = '#ffffff'
        })

        document.getElementById('fontSize').addEventListener('input', (e) => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].font = `${e.target.value}px Arial` // Update font size
                drawCanvas()
            }
        })

        document.getElementById('fontStyle').addEventListener('change', (e) => {
            if (selectedTextIndex >= 0) {
                const fontSize = textBlocks[selectedTextIndex].font.split(' ')[0] // Keep current size
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
                textBlocks.splice(selectedTextIndex, 1) // Remove the selected block
                selectedTextIndex = -1 // Deselect
                drawCanvas()
            }
        })
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            textBlocks = [] // Clear all text blocks
            selectedTextIndex = -1 // Deselect
            drawCanvas()
        })
        
    
        canvas.addEventListener('mousedown', (e) => {
            const mouseX = e.offsetX
            const mouseY = e.offsetY
        
            // Find the clicked text block
            selectedTextIndex = textBlocks.findIndex(block => {
                const textWidth = ctx.measureText(block.text).width
                return (
                    mouseX >= block.x - 5 &&
                    mouseX <= block.x + textWidth + 5 &&
                    mouseY >= block.y - 25 &&
                    mouseY <= block.y + 5
                )
            })
        
            // If a text block is selected, load its properties into the controls
            if (selectedTextIndex >= 0) {
                isDragging = true
                const selectedBlock = textBlocks[selectedTextIndex]
                document.getElementById('memeText').value = selectedBlock.text
                document.getElementById('textColor').value = selectedBlock.color
            }
        
            drawCanvas()
        })
        
    
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging && selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].x = e.offsetX
                textBlocks[selectedTextIndex].y = e.offsetY
                drawCanvas()
            }
        })

        document.getElementById('saveBtn').addEventListener('click', () => {
            // Save the canvas as an image
            const memeImage = canvas.toDataURL('image/png')
        
            // Save the meme with its text blocks
            savedMemes.push({
                image: memeImage,
                textBlocks: [...textBlocks] // Save a copy of the current text blocks
            })
        
            showModal('Meme saved successfully!')
        })
    
        canvas.addEventListener('mouseup', () => {
            isDragging = false
        })
    
        function addTextBlock(text = '', x = 50, y = 50, color = '#ffffff', font = '30px Arial') {
            textBlocks.push({ text, x, y, color, font })
            selectedTextIndex = textBlocks.length - 1
            drawCanvas()
        }
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
    
    

// Function to draw the canvas with the current text
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

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



function openAboutModal() {
    const modal = document.createElement('div')
    modal.className = 'modal'

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h1 class="title">About</h1>
            <p>HA HA HA! This is a Joker-themed meme generator. Select a template and start making fun of Batsy and his Super-Friends!</p>
        </div>
    `
    document.body.appendChild(modal)

    // Close the modal when the "X" button is clicked
    const closeBtn = modal.querySelector('.close-btn')
    closeBtn.addEventListener('click', () => {
        modal.remove()
    })
}


    // Add a new text block
function addTextBlock(text = '', x = 50, y = 50, color = '#ffffff', font = '30px Arial') {
    textBlocks.push({ text, x, y, color, font })
    selectedTextIndex = textBlocks.length - 1 // Automatically select the new block
    drawCanvas()
}

// Draw all text blocks and highlight the selected one
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

    textBlocks.forEach((block, index) => {
        ctx.fillStyle = block.color
        ctx.font = block.font
        ctx.fillText(block.text, block.x, block.y)

        // Draw a border around the selected text block
        if (index === selectedTextIndex) {
            const textWidth = ctx.measureText(block.text).width
            ctx.strokeStyle = '#ff0000' // Red border for the selected text
            ctx.strokeRect(block.x - 5, block.y - 25, textWidth + 10, 30)
        }
    })
}
    
    
document.getElementById('savedBtn').addEventListener('click', () => {
    content.innerHTML = `
        <h1 class="title">Saved Memes</h1>
        <div id="savedGallery" class="gallery"></div>
    `

    const savedGallery = document.getElementById('savedGallery')

    savedMemes.forEach((meme, index) => {
        const memeContainer = document.createElement('div')
        memeContainer.className = 'meme-container'

        const img = document.createElement('img')
        img.src = meme.image
        img.alt = `Meme ${index + 1}`
        img.className = 'gallery-img'

        memeContainer.appendChild(img)
        savedGallery.appendChild(memeContainer)
    })

    // Reattach the About button listener
    const aboutBtn = document.getElementById('aboutBtn')
    if (aboutBtn) {
        aboutBtn.addEventListener('click', openAboutModal)
    }
})


document.getElementById('crazyBtn').addEventListener('click', () => {
    const content = document.getElementById('content')

    // Debug: Check if `content` exists
    console.log('Content element:', content)

    // Inject spinner
    content.innerHTML = `
        <div class="spinner">
            <p>Getting Crazy...</p>
        </div>
    `

    // Debug: Check if spinner HTML is added
    console.log('Updated content innerHTML:', content.innerHTML)

    // Delay loading the editor
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * images.length)
        const randomImage = images[randomIndex]

        loadEditor(randomImage)
    }, 2000)
})






galleryBtn.addEventListener('click', () => {
    textBlocks = [] // Clear any meme editing state
    selectedTextIndex = -1
    loadGallery()
})

    // Load the gallery immediately when the page loads
    loadGallery()
})






