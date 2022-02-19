import React from 'react'
import ReactDOM from 'react-dom';

const taskEnque = [];
const components = [];
const emptyQueue = () => {
    let item, conpoment;
    while (item = taskEnque.shift()) {
        const { stateOrStateFn, component } = item;
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        if (typeof stateOrStateFn === 'function') {
            Object.assign(component.state, stateOrStateFn(component.prevState, component.props));
        } else {
            Object.assign(component.state, stateOrStateFn);
        }
        component.prevState = component.state;
    }
    /** 更新组件 */
    while (conpoment = components.shift()) {
        conpoment.forceUpdate();
    }
}
const defer = (fn) => {
    return Promise.resolve().then(fn);
};
const enqueueSetState = (stateOrStateFn, component) => {
    if (taskEnque.length === 0) {
        // 放在下一个任务队列
        defer(emptyQueue);
    }
    // 添加不重复的组件如：Foo、Bar
    if (!components.includes(component)) {
        components.push(component);
    }
    taskEnque.push({
        stateOrStateFn,
        component
    });
}

class Foo extends React.Component {
    state = {
        num: 0,
    }
    componentDidMount() {
        for (let i = 0; i < 5; i++) {
            // this.setState({ num: this.state.num + 1 });
            this.setState(prevState => {
                console.log(prevState.num);
                return {
                    num: prevState.num + 1
                }
            });
        }
    }
    // 模拟setState
    setState(stateOrStateFn) {
        enqueueSetState(stateOrStateFn, this);
    }
    render() {
        console.log('forceUpdate')
        return (
            <div>
                <div>Foo:{this.state.num}</div>
            </div>
        )
    }
}
class Bar extends React.Component {
    state = {
        num: 0,
    }
    componentDidMount() {
        for (let i = 0; i < 5; i++) {
            this.setState({ num: this.state.num + 1 });
        }
    }
    setState(stateOrStateFn) {
        enqueueSetState(stateOrStateFn, this);
    }
    render() {
        return (
            <div>
                Bar:{this.state.num}
            </div>
        )
    }
}
class App extends React.Component {
    render() {
        return (
            <div>
                <div>class</div>
                <div style={{ marginLeft: '40px' }}>
                    <Foo></Foo>
                    <Bar></Bar>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

