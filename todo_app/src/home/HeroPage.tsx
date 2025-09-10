import { useState } from "react";
import AddTask from "./AddTask";
import AllTasks from "./AllTasks";

function HeroPage() {
    const [refresh, setRefresh] = useState(false);
    return ( 
        <section className="min-h-screen bg-slate-950">
            <div className="flex justify-center flex-col sm:flex-row items-center pt-5">
                <div className="bg-red-300/10 gap-8 text-center p-6 rounded-xl">
                    <AddTask onAddedTask={() => setRefresh((prev) => !prev)} />
                    <AllTasks refresh={refresh} />
                </div>
            </div>
        </section>
     );
}

export default HeroPage;