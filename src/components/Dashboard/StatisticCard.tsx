type CartProps = {
    icon: React.ReactNode,
    title: string,
    body: string,
    result: string,
}

export default function StatisticCard({item}: { item: CartProps }) {
    return (
        <div
            className="rounded-2xl border border-gray-50 bg-white p-3 md:p-5">
            <div className={'flex justify-between items-center'}>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
                    {item.icon}
                </div>
                <p className={'text-md text-gray-400 font-light'}>{item.title}</p>
            </div>


            <div className="flex items-end justify-between mt-5">
                <div>
                    <h3 className="mt-2 font-bold text-gray-800 text-2xl md:text-3xl">
                        {item.result}
                    </h3>
                    <span className="text-md leading-[12px] md:text-md text-gray-400 font-light ">
              {item.body}
            </span>

                </div>
            </div>
        </div>);
}
