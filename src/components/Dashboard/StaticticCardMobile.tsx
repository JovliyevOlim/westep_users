type CartProps = {
    icon: React.ReactNode,
    title: string,
    body: string,
    result: string,
}

export default function StatisticCardMobile({item}: { item: CartProps }) {
    return (
        <div
            className="rounded-[18px] border border-blue-200 bg-white overflow-hidden">
            <div className={'flex justify-between items-center bg-blue-50 py-2 px-4'}>
                <div className="flex items-center justify-center rounded-xl">
                    {item.icon}
                </div>
                <p className={'text-xs md:text-md text-primary-500 font-medium'}>{item.title}</p>
            </div>


            <div className="flex items-end justify-between mb-1 px-4">
                <div>
                    <h3 className="mt-2 font-bold text-gray-800 text-xl md:text-3xl">
                        {item.result}
                    </h3>
                    <span className="text-xs leading-[12px] md:text-md text-gray-400 font-light ">
              {item.body}
            </span>

                </div>
            </div>
        </div>);
}
