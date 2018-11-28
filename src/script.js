window.addEventListener('load', _ready, false)

let input_textbox
let input_button
let xs

/**
 * Generate logspace.
 * @param {Float} min Starting number
 * @param {Float} max Ending number
 * @param {Float} step Step (multiplied by)
 */
function logspace(min, max, step){
    var v = []
    for(var i = min; i <= max; i *= step){
        v.push(i);
    }
    return v;
}

function _ready(){
    xs = logspace(1e-2, 1e6, 10)

    input_textbox = document.getElementById("transfer-function")
    input_textbox.addEventListener("change", update_tf, false)
    input_button = document.getElementById("button-compute")
    input_button.disabled = true
    input_button.addEventListener("click", bode_plot, false)
}

let tf = math.parse('s')
let compiled

function update_tf(){
    input_button.disabled = true
    tf = math.parse(input_textbox.value)
    compiled = tf.compile()
    try {
        compiled.eval({'s': math.complex(0, 1)})
        input_button.disabled = false
        document.getElementById("output").textContent = tf
    } catch(err){
        document.getElementById("output").textContent = err
    }
}

function bode_plot(){
    var y = xs.map((w) => {
        return compiled.eval({s: math.complex(0, w)}).abs()
    })

    var ctx = document.getElementById("plot").getContext('2d')
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                data: y
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    type: 'logarithmic'
                }]
            }
        }
        // ,
        // options: {
        //     scales: {
        //         xAxes: [{
        //             type: 'linear',
        //             ticks: {
        //                 min: 0.01,
        //                 max: 1e6
        //             }
        //         }],
        //         yAxes: [{
        //             type: 'linear',
        //             ticks: {
        //                 min: 0.01,
        //                 max: 1e2
        //             }
        //         }]
        //     }
        // }
    })
}