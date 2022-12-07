import { useEffect, useRef, useState } from 'react'
import { FaTrash, FaPlus } from 'react-icons/fa'

interface EditListProps {
    title: string;
    items: string[];
    setItems: (newItems: string[]) => void;
    max: number;
}

function EditList({ title, items, setItems, max }: EditListProps) {
    return (
        <div className="mb-5">
            <div className="flex items-center justify-between">
                <span>{ title }</span>
                {
                    items.length < max && (
                        <FaPlus 
                            className="cursor-pointer"
                            onClick={() => {
                                setItems([...items, ''])
                            }}/>
                    )
                }
            </div>
            { items.map((item, index) => (
                <div key={index} className="flex items-center my-5">
                    <input
                            className="border border-gray-400 w-full mr-5 px-2 py-0.5"
                            value={item}
                            onChange={(e) => {
                                setItems([...items.slice(0, index), e.target.value, ...items.slice(index + 1)])
                            }}/>
                    <FaTrash
                        className="cursor-pointer"
                        onClick={() => {
                            setItems([...items.slice(0, index), ...items.slice(index + 1)])
                        }}/>
                </div>
            ))}
        </div>
    )
}

interface ChoiceFormProps {
    choices: [string[], string[]];
    setChoices: (choices: [string[], string[]]) => void;
    createAmidakuji: () => void;
}

function ChoiceForm({ choices, setChoices, createAmidakuji }: ChoiceFormProps) {
    const [error, setError] = useState('')
    function onSubmitForm () {
        if (choices[0].length === 0 || choices[1].length === 0) {
            setError('The lists must be non empty.')
            return
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < choices[i].length; j++) {
                if (choices[i][j] === '') {
                    setError('All text fields must be non empty.')
                    return
                }
            }
        }

        if (choices[0].length !== choices[1].length) {
            setError('The lists must have equal length.')
            return
        }

        if (choices[0].length === 1) {
            setError('The lists must have at least 2 elements.')
            return
        }

        createAmidakuji()
    }
    return (
        <div>
            <p className="text-center">{ error }</p>
            <EditList title='List 1'
                        items={choices[0]}
                        setItems={(newItems) => {
                            setChoices([newItems, choices[1]])
                        }}
                        max={5}/>
            <EditList title='List 2'
                        items={choices[1]}
                        setItems={(newItems) => {
                            setChoices([choices[0], newItems])
                        }}
                        max={5}/>
            <div className="flex justify-center">
                <button className="bg-slate-900 text-white rounded px-2 py-1"
                        onClick={onSubmitForm}>Create amidakuji</button>
            </div>
        </div>
    )
}

interface DrawAmidakujiProps {
    numberOfItems: number;
    amidakuji: number[]; // This stores the indices of the left vertical line connected by a horizontal line, from top to bottom.
    setResult: (result: number[]) => void;
}

enum SegmentDirection {
    Down,
    Left,
    Right
}

const COLORS = ['rgb(0, 0, 150)','rgb(0, 100, 0)','#f97316','#ec4899','purple']
const STEP_SIZE = 2

function DrawAmidakuji({ numberOfItems, amidakuji, setResult }: DrawAmidakujiProps) {
    const [started, setStarted] = useState(false)
    const canvasRef = useRef(null as null | HTMLCanvasElement)
    const ctxRef = useRef(null as null | CanvasRenderingContext2D)
    const [currentCoordinates, setCurrentCoordinates] = useState([30, 20])
    const [currentSegment, setCurrentSegment] = useState({
        xIndex: 0,
        yIndex: 0,
        // This is the direction we travel during the animation,
        // - [xIndex, yIndex] always refer to the coordinates of the top/left end of the segment.
        direction: SegmentDirection.Down
    })
    const [matches, setMatches] = useState([] as number[])

    useEffect(() => {
        if (!canvasRef.current) {
            alert("Couldn't draw the amidakuji.")
            return
        }
        ctxRef.current = canvasRef.current?.getContext('2d')
        if (!ctxRef.current) {
            alert("Couldn't draw the amidakuji.")
            return
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
        const dpr = window.devicePixelRatio
        const rect = canvasRef.current.getBoundingClientRect()

        canvasRef.current.width = rect.width * dpr
        canvasRef.current.height = rect.height * dpr

        ctxRef.current.scale(dpr, dpr)

        canvasRef.current.style.width = `${rect.width}px`
        canvasRef.current.style.height = `${rect.height}px`

        ctxRef.current.lineWidth = 5.0
        ctxRef.current.font = '15px sans-serif'
        ctxRef.current.strokeStyle = 'rgb(200, 200, 200)'

        for (let i = 0; i < numberOfItems; i++) {
            // Vertical lines of the amidakuji.
            ctxRef.current.beginPath()
            ctxRef.current.moveTo(30 + Math.floor(i * 240 / (numberOfItems - 1)), 20)
            ctxRef.current.lineTo(30 + Math.floor(i * 240 / (numberOfItems - 1)), 280)
            ctxRef.current.stroke()

            // The numbers at the top and bottom.
            ctxRef.current.fillText(`${i + 1}`, 26 + Math.floor(i * 240 / (numberOfItems - 1)), 15)
            ctxRef.current.fillText(`${i + 1}`, 26 + Math.floor(i * 240 / (numberOfItems - 1)), 295)
        }

        // Horizontal lines
        amidakuji.forEach((line, index) => {
            ctxRef.current?.beginPath()
            ctxRef.current?.moveTo(30 + Math.floor(line * 240 / (numberOfItems - 1)), 20 + Math.floor((index + 1) * 260 / (amidakuji.length + 1)))
            ctxRef.current?.lineTo(30 + Math.floor((line + 1) * 240 / (numberOfItems - 1)), 20 + Math.floor((index + 1) * 260 / (amidakuji.length + 1)))
            ctxRef.current?.stroke()
        })

        ctxRef.current.strokeStyle = COLORS[0]
    }, [])

    useEffect(() => {
        if (started) {
            function drawPath() {
                if (!ctxRef.current) {
                    return
                }
                if (currentSegment.direction === SegmentDirection.Down) {
                    ctxRef.current.beginPath()
                    ctxRef.current.moveTo(currentCoordinates[0], 20 + Math.floor(currentSegment.yIndex * 260 / (amidakuji.length + 1)))
        
                    // Check whether we can make a step of STEP_SIZE.
                    if (currentCoordinates[1] + STEP_SIZE < 20 + Math.floor((currentSegment.yIndex + 1) * 260 / (amidakuji.length + 1))) {
                        ctxRef.current.lineTo(currentCoordinates[0], currentCoordinates[1] + STEP_SIZE)
                        ctxRef.current.stroke()
                        setCurrentCoordinates([currentCoordinates[0], currentCoordinates[1] + STEP_SIZE])
                    }
                    else {
                        ctxRef.current.lineTo(currentCoordinates[0], 20 + Math.floor((currentSegment.yIndex + 1) * 260 / (amidakuji.length + 1)))
                        ctxRef.current.stroke()
                        
                        // Find the next segment.
                        if (currentSegment.yIndex < amidakuji.length) { // Current path from top isn't over.
                            setCurrentCoordinates([currentCoordinates[0], 20 + Math.floor((currentSegment.yIndex + 1) * 260 / (amidakuji.length + 1))])
                            if (amidakuji[currentSegment.yIndex] === currentSegment.xIndex) { // There is an edge to the right.
                                setCurrentSegment({
                                    xIndex: currentSegment.xIndex,
                                    yIndex: currentSegment.yIndex + 1,
                                    direction: SegmentDirection.Right
                                })
                            }
                            else if (amidakuji[currentSegment.yIndex] + 1 === currentSegment.xIndex) { // There is an edge to the left.
                                setCurrentSegment({
                                    xIndex: currentSegment.xIndex - 1,
                                    yIndex: currentSegment.yIndex + 1,
                                    direction: SegmentDirection.Left
                                })
                            }
                            else { // There is no horizontal edge, so we go down.
                                setCurrentSegment({
                                    xIndex: currentSegment.xIndex,
                                    yIndex: currentSegment.yIndex + 1,
                                    direction: SegmentDirection.Down
                                })
                            }
                        }
                        else if (matches.length < numberOfItems - 1) { // Current path from top is over, so we start the next path from top.
                            ctxRef.current.strokeStyle = COLORS[matches.length + 1]
                            setCurrentCoordinates([30 + Math.floor((matches.length + 1) * 240 / (numberOfItems - 1)), 20])
                            setCurrentSegment({
                                xIndex: matches.length + 1,
                                yIndex: 0,
                                direction: SegmentDirection.Down
                            })
                            setMatches([...matches, currentSegment.xIndex])
                        }
                        else { // No more paths left.
                            setResult([...matches, currentSegment.xIndex])
                            return
                        }
                    }
                }
                else if (currentSegment.direction === SegmentDirection.Right) {
                    ctxRef.current.beginPath()
                    ctxRef.current.moveTo(30 + Math.floor(currentSegment.xIndex * 240 / (numberOfItems - 1)), currentCoordinates[1])
        
                    // Check whether we can make a step of STEP_SIZE.
                    if (currentCoordinates[0] + STEP_SIZE < 30 + Math.floor((currentSegment.xIndex + 1) * 240 / (numberOfItems - 1))) {
                        ctxRef.current.lineTo(currentCoordinates[0] + STEP_SIZE, currentCoordinates[1])
                        ctxRef.current.stroke()
                        setCurrentCoordinates([currentCoordinates[0] + STEP_SIZE, currentCoordinates[1]])
                    }
                    else {
                        ctxRef.current.lineTo(30 + Math.floor((currentSegment.xIndex + 1) * 240 / (numberOfItems - 1)), currentCoordinates[1])
                        ctxRef.current.stroke()
                        setCurrentCoordinates([30 + Math.floor((currentSegment.xIndex + 1) * 240 / (numberOfItems - 1)), currentCoordinates[1]])
                        setCurrentSegment({
                            xIndex: currentSegment.xIndex + 1,
                            yIndex: currentSegment.yIndex,
                            direction: SegmentDirection.Down
                        })
                    }
                }
                else {
                    ctxRef.current.beginPath()
                    ctxRef.current.moveTo(30 + Math.floor((currentSegment.xIndex + 1) * 240 / (numberOfItems - 1)), currentCoordinates[1])
        
                    // Check whether we can make a step of STEP_SIZE.
                    if (currentCoordinates[0] - STEP_SIZE > 30 + Math.floor(currentSegment.xIndex * 240 / (numberOfItems - 1))) {
                        ctxRef.current.lineTo(currentCoordinates[0] - STEP_SIZE, currentCoordinates[1])
                        ctxRef.current.stroke()
                        setCurrentCoordinates([currentCoordinates[0] - STEP_SIZE, currentCoordinates[1]])
                    }
                    else {
                        ctxRef.current.lineTo(30 + Math.floor(currentSegment.xIndex * 240 / (numberOfItems - 1)), currentCoordinates[1])
                        ctxRef.current.stroke()
                        setCurrentCoordinates([30 + Math.floor(currentSegment.xIndex * 240 / (numberOfItems - 1)), currentCoordinates[1]])
                        setCurrentSegment({
                            xIndex: currentSegment.xIndex,
                            yIndex: currentSegment.yIndex,
                            direction: SegmentDirection.Down
                        })
                    }
                }
            }

            const handle = requestAnimationFrame(drawPath)
            return () => { cancelAnimationFrame(handle) }
        }
    }, [started, currentCoordinates, currentSegment])

    return (
        <div className='relative'>
            <canvas className='border border-black mx-auto' ref={canvasRef} width="300" height="300"></canvas>
            {
                !started && (
                    <div className='absolute flex items-center justify-center left-0 top-0 w-full h-full bg-white/50'>
                        <button className='bg-slate-900 text-white rounded px-2 py-1' onClick={() => { setStarted(true) }}>Play</button>
                    </div>
                )
            }
        </div>
    )
}

interface AmidakujiResultProps {
    choices: [string[], string[]];
    result: number[];
}

function AmidakujiResult({ choices, result }: AmidakujiResultProps) {
    return (
        <div className='my-3'>
            <p className='font-bold text-lg'>Results</p>
            { result.map((list2Index, list1Index) => (
                <p key={list1Index} className='break-words'>{`${choices[0][list1Index]} matches with ${choices[1][list2Index]}.`}</p>
            ))}
        </div>
    )
}

function AmidakujiPage() {
    const [choices, setChoices] = useState([[], []] as [string[], string[]])
    const [amidakuji, setAmidakuji] = useState(null as null | number[])
    const [result, setResult] = useState(null as null | number[])

    function createAmidakuji() {
        let amidakuji = []
        const numberOfHorizontalLines = 7 + Math.floor(Math.random() * 5)
        for (let i = 0; i < numberOfHorizontalLines; i++) {
            // Push the index of the left vertical line joined by the horizontal line.
            amidakuji.push(Math.floor(Math.random() * (choices[0].length - 1)))
        }
        setAmidakuji(amidakuji)
    }

    function reset() {
        setChoices([[], []])
        setAmidakuji(null)
        setResult(null)
    }

    return (
        <div>
            { amidakuji === null && <ChoiceForm choices={choices} setChoices={setChoices} createAmidakuji={createAmidakuji}/> }
            { amidakuji !== null && <DrawAmidakuji numberOfItems={choices[0].length} amidakuji={amidakuji} setResult={setResult}/> }
            { result !== null && <AmidakujiResult choices={choices} result={result}/> }
            { result !== null && (
                <div className='flex justify-center'>
                    <button onClick={reset} className='bg-slate-900 text-white rounded px-2 py-1'>New amidakuji</button>
                </div>
            )}
        </div>
    )
}

export default AmidakujiPage