document.addEventListener('DOMContentLoaded', () => {
    const galleryBtn = document.getElementById('galleryBtn')
    const aboutBtn = document.getElementById('aboutBtn')
    const content = document.getElementById('content')

    const savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || []

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

        images.forEach(imgName => {
            const img = document.createElement('img')
            img.src = imgName
            img.alt = 'Meme'
            img.className = 'gallery-img'
            img.addEventListener('click', () => loadEditor(imgName))
            gallery.appendChild(img)
        })

        if (aboutBtn) {
            aboutBtn.addEventListener('click', openAboutModal)
        }
    }

    function loadEditor(selectedImage, savedTextBlocks = []) {
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
        const img = new Image()
        img.src = selectedImage

        let textBlocks = [...savedTextBlocks]
        selectedTextIndex = -1

        img.onload = () => {
            const maxCanvasWidth = window.innerWidth * 0.9
            const maxCanvasHeight = window.innerHeight * 0.9

            const imgAspectRatio = img.width / img.height
            const canvasAspectRatio = maxCanvasWidth / maxCanvasHeight

            if (imgAspectRatio > canvasAspectRatio) {
                canvas.width = maxCanvasWidth
                canvas.height = maxCanvasWidth / imgAspectRatio
            } else {
                canvas.height = maxCanvasHeight
                canvas.width = maxCanvasHeight * imgAspectRatio
            }

            drawCanvas()
        }

        function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            textBlocks.forEach(block => {
                ctx.fillStyle = block.color
                ctx.font = block.font
                ctx.fillText(block.text, block.x, block.y)
            })
        }

        document.getElementById('addTextBlockBtn').addEventListener('click', () => {
            addTextBlock('New Text', 50, 50)
        })

        document.getElementById('memeText').addEventListener('input', (e) => {
    if (selectedTextIndex >= 0) {
        textBlocks[selectedTextIndex].text = e.target.value
        drawCanvas()
    }
})


        document.getElementById('textColor').addEventListener('input', (e) => {
    if (selectedTextIndex >= 0) {
        textBlocks[selectedTextIndex].color = e.target.value
        drawCanvas()
    }
})

        document.getElementById('fontSize').addEventListener('input', (e) => {
    if (selectedTextIndex >= 0) {
        const fontSize = `${e.target.value}px`
        const currentFont = textBlocks[selectedTextIndex].font.split(' ')
        currentFont[0] = fontSize
        textBlocks[selectedTextIndex].font = currentFont.join(' ')
        drawCanvas()
    }
})


        document.getElementById('saveBtn').addEventListener('click', () => {
            const memeImage = canvas.toDataURL('image/png')

            savedMemes.push({
                image: memeImage,
                textBlocks: [...textBlocks]
            })

            localStorage.setItem('savedMemes', JSON.stringify(savedMemes))
            showModal('Meme saved successfully!')
        })

        canvas.addEventListener('mousemove', (e) => {
    if (selectedTextIndex >= 0 && isDragging) {
        textBlocks[selectedTextIndex].x = e.offsetX
        textBlocks[selectedTextIndex].y = e.offsetY
        drawCanvas()
    }
})

       canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX
    const mouseY = e.offsetY

    // Find the index of the text block under the mouse
    selectedTextIndex = textBlocks.findIndex(block => {
        const textWidth = ctx.measureText(block.text).width
        return (
            mouseX >= block.x - 5 &&
            mouseX <= block.x + textWidth + 5 &&
            mouseY >= block.y - 25 &&
            mouseY <= block.y + 5
        )
    })

    if (selectedTextIndex >= 0) {
        const selectedBlock = textBlocks[selectedTextIndex]

        // Populate the input fields with the selected block's properties
        document.getElementById('memeText').value = selectedBlock.text
        document.getElementById('textColor').value = selectedBlock.color
        const fontSize = selectedBlock.font.split(' ')[0]
        document.getElementById('fontSize').value = parseInt(fontSize, 10)
    }

    drawCanvas()
})
        
        canvas.addEventListener('mousemove', (e) => {
            if (selectedTextIndex >= 0) {
                textBlocks[selectedTextIndex].x = e.offsetX
                textBlocks[selectedTextIndex].y = e.offsetY
                drawCanvas()
            }
        })

        canvas.addEventListener('mouseup', () => {
            selectedTextIndex = -1
        })

        document.getElementById('backToGalleryBtn').addEventListener('click', loadGallery)

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

    document.getElementById('savedBtn').addEventListener('click', () => {
        content.innerHTML = `
            <h1 class="title">Saved Memes</h1>
            <div id="savedGallery" class="gallery"></div>
        `

        const savedGallery = document.getElementById('savedGallery')

        if (savedMemes.length === 0) {
            savedGallery.innerHTML = `<p>No saved memes found!</p>`
            return
        }

        savedMemes.forEach((meme, index) => {
            const memeContainer = document.createElement('div')
            memeContainer.className = 'meme-container'

            const img = document.createElement('img')
            img.src = meme.image
            img.alt = `Meme ${index + 1}`
            img.className = 'gallery-img'

            img.addEventListener('click', () => {
                loadEditor(meme.image, meme.textBlocks)
            })

            memeContainer.appendChild(img)
            savedGallery.appendChild(memeContainer)
        })
    })

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

        const closeBtn = modal.querySelector('.close-btn')
        closeBtn.addEventListener('click', () => {
            modal.remove()
        })
    }

    galleryBtn.addEventListener('click', loadGallery)

    loadGallery()
})


