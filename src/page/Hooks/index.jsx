import React from 'react';
import ReactDOM from 'react-dom';

let state = [],
    index = 0,
    isRender = true;
const defer = (fn) => {
    return Promise.resolve().then(() => {
        isRender = true;
        fn();
    });
};
function useState(initialValue) {
    // 保存当前的索引;
    let currentIndex = index;
    if (typeof initialValue === "function") {
        initialValue = initialValue();
    }
    // render时候更新state
    state[currentIndex] =
        state[currentIndex] === undefined ? initialValue : state[currentIndex];
    const setState = newValue => {
        // debugger
        if (typeof newValue === "function") {
            // 函数式更新
            newValue = newValue(state[currentIndex]);
        }
        state[currentIndex] = newValue;
        if (isRender) {
            defer(renderComponent);
        }
        index = 0;
        isRender = false;
    };
    index += 1;
    return [state[currentIndex], setState];
}

const App = () => {
    const [num, setNum] = useState(0);
    const [count, setCount] = useState(1);
    const inputClick = (type) => {
        // setCount(num+1)
        return () => {
            if (type === 'num') {
                for (let index = 0; index < 5; index++) {
                    setNum((preState) => preState + 1);
                }
            }
            else {
                for (let index = 0; index < 5; index++) {
                    setCount(count + 1);
                }
            }
        }
    }
    // 测试绑定原生的dom事件 setstate更新是同步
    //  useEffect(()=>{
    //     ref.current.onclick=inputClick;
    // },[])
    return (<>
        <div>hooks</div>
        <div style={{ marginLeft: '40px' }}>
            <button onClick={inputClick('num')}>addNum </button>
            <span>{num}</span>
            <div style={{ height: '10px' }}></div>
            <button onClick={inputClick('count')}>addCount </button>
            {/* <button ref={ref}>StateAsync</button> */}
            <span>{count}</span>
        </div>
    </>)
}

function renderComponent() {
    ReactDOM.render(
        <App />,
        document.getElementById('hooks-root')
    );
}
renderComponent();

