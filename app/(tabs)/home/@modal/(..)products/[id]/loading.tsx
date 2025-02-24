
export default function Loading() {

    return (
        <div 
            className="
                absolute w-full h-full z-50 flex justify-center items-center
                bg-black bg-opacity-60 left-0 top-0"
        >
            <div className="
                max-w-screen-sm w-full h-auto mt-14
                flex justify-center flex-col gap-2 animate-pulseCustom"
            >

                <div className="w-full py-2 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="relative size-10 rounded-full bg-neutral-700"></div>

                        <div className="w-32 h-10 rounded-md bg-neutral-700"></div>
                    </div>

                    <div className="bg-neutral-700 w-12 h-10 rounded-md"></div>
                </div>

                <div 
                    className="
                        w-full aspect-square bg-neutral-700
                        rounded-md flex justify-center items-center"
                >
                    <div className="w-full h-full"></div>
                </div>

                <div className="py-5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className="w-32 h-10 bg-neutral-700 rounded-md"></h1>
                        <span className="w-32 h-10 bg-neutral-700 rounded-md"></span>
                    </div>

                    <p className="w-full h-10 bg-neutral-700 rounded-md"></p>
                </div>
            </div>
        </div>
    )
}