function AboutPage() {
    return (
        <div className='space-y-3'>
            <p>Amidakuji (Japanese name) is a method of creating random pairs (one from each list) from two lists of the same size.</p>
            <p>
                We draw a bunch of vertical lines (as many as the size of either list).
                We place items from the first list on top of each line (one item, one line), and items from the second list at the bottom.
            </p>
            <p>We randomly draw horizontal lines joining two consecutive vertical lines (we make sure that no two are drawn at the same height).</p>
            <p>
                Now for any item in the first list, we start at the top of it's line and walk down. 
                Whenever we end up at an end of a horizontal line, we travel to the other end and continue walking down. 
                In the end, whichever item we reach is the item we pair the initial item with.
            </p>
            <p>
                Some resources:
                <ul className="list-disc">
                    <li><a href="https://en.wikipedia.org/wiki/Ghost_Leg" className="underline">Wikipedia article</a></li>
                    <li><a href="https://www.tofugu.com/japan/amidakuji/" className="underline">Tofugu article</a></li>
                </ul>
            </p>
        </div>
    )
}

export default AboutPage