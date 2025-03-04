
export default async function ListCommentSkeleton() {

    const skeletons = Array.from({ length: 10 }, (_, index) => (
        <div 
            key={index}
            className="
            flex flex-col gap-5 w-full my-3 pb-5 mt-8
            border-b border-neutral-500 animate-pulse"
        >
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <div
                        className="
                        flex items-center size-7 rounded-full bg-neutral-500"
                    />
        
                    <div 
                        className="
                        flex items-center w-24 h-7 bg-neutral-500 rounded-full"
                    />
                </div>
        
                <span className="flex items-center w-20 h-7 bg-neutral-500 rounded-full" />
            </div>
        
            <p className="bg-neutral-500 w-full h-7 rounded-full" />
        </div>
    ));

    return <>{skeletons}</>;
}