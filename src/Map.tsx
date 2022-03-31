import React, { useEffect } from 'react'
import './Map.css'
import { BOTTOM_GROUP, CLIP_PATH_GROUP, TEXTURE_GROUP, TOP_GROUP } from './mapSvg.tsx'
function setAttributes(element, attribute) {
    Object.keys(attribute).forEach(key => {
        element.setAttribute(key, attribute[key])
    })
}
function createText(value: string) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
    const textContent = document.createTextNode(value)
    text.appendChild(textContent)
    return text
}
/**扩散函数 */
function circleExpand(element, initR) {
    const t = setInterval(function () {
        //修改圆形半径，每次变大5%
        let r = element.getAttribute('r');
        r *= 1.08; //隐式的浮点数解析
        element.setAttribute('r', r);
        //修改圆形透明度，每次减小5%
        let p = element.getAttribute('opacity');
        p *= 0.55;
        element.setAttribute('opacity', p);
        console.log(element, '12', p)

        if (p <= 0.001) {  //已经透明几乎看不见了
            element.setAttribute('opacity', 1)
            element.setAttribute('r', initR)
            clearInterval(t);
            // svg19.removeChild(c);//从DOM上删除圆形
        }

    }, 30);
}
export default function Map() {
    const group = document.querySelector('#circle-group')
    useEffect(() => {
        addModal()
        const ccc = addCircle(60, 260)

        setTimeout(() => {
            addCircle(300, 260)
            setTimeout(() => {
                addLine(60, 260, 300, 260)
            }, 1000);
            setTimeout(() => {
                const circle1 = ccc.cloneNode(true)
                const group = document.querySelector('#circle-group')
                group.appendChild(circle1)
                circleExpand(circle1, circle1.getAttribute('r'))

            }, 3000);
        }, 1000);
    }, [])
    function addCircle(cx, cy) {
        const group = document.querySelector('#circle-group')
        const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
        setAttributes(circle, {
            opacity: 0,
            cx,
            cy,
            r: 15,
            style: "transition: opacity 1s ease-in",
            stroke: '#F5003C',
            'stroke-width': 8,
            fill: 'none'
        })
        group.appendChild(circle)
        setTimeout(() => {
            setAttributes(circle, {
                opacity: 1
            })
        }, 0);
        console.log(circle, 'cc')
        return circle
    }
    function addLine(x1, y1, x2, y2) {
        const group = document.querySelector('#circle-group')
        const start = `M ${x1} ${y1}`
        const curve = `C ${(x1 + x2) / 2} ${y1 / 2} ${(x1 + x2) / 2} ${(y1 / 2)} ${x2} ${y2}`
        const end = `L ${x2} ${y2}`
        const d = `${start} ${curve} ${end}`
        const path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        const length = path.getTotalLength()
        setAttributes(path, {
            d,
            style: "transition: stroke-dashoffset 1s ease-in-out",
            fill: 'transparent',
            stroke: 'rgba(0,0,0,0.5)',
            'stroke-dasharray': `${length} ${length}`,
            'stroke-dashoffset': length,
            'stroke-width': 8
        })
        group.appendChild(path)
        setTimeout(() => {
            setAttributes(path, {
                'stroke-dashoffset': 0
            })
        }, 0);
    }
    function addModal() {
        const group = document.querySelector('#circle-group')
        const path = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        const startX = 300 - 80
        const startY = 260 + 40
        const endX = startX + 200
        /**折角 */
        const fold = 20
        const d = `M ${startX} ${startY}
            L ${endX} ${startY} 
            L ${endX + fold} ${startY + fold}
            L ${endX + fold} ${startY + 100}
            L ${startX - fold} ${startY + 100}
            L ${startX - fold} ${startY + fold}
            Z
        `
        setAttributes(path, {
            d,
            stroke: 'black',
            fill: 'rgb(14, 44, 89)',
            opacity: 0.8
        })

        const text = createText('新发货')
        setAttributes(text, {
            x: startX + 20,
            y: startY + 40,
            style: "fill:#59c0af;stroke:#59c0af;stroke-width:0.5",
        })
        group.appendChild(path)
        group.appendChild(text)
        console.log(1)
    }
    return (
        <div className='map'>
            <svg
                id="template"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink='http://www.w3.org/1999/xlink'
                // xmlAmcharts=''
                // xmlns:amcharts="http://amcharts.com/ammap"
                version="1.1">
                <defs>
                    <rect id="path-1" x="0" y="0" width="2484" height="1690"></rect>
                </defs>
                {BOTTOM_GROUP}
                {CLIP_PATH_GROUP}
                {TEXTURE_GROUP}
                {TOP_GROUP}
                <g id="circle-group"></g>
            </svg>
        </div>
    )
}
