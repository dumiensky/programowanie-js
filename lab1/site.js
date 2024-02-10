const container = document.querySelector('#container');
const result = document.querySelector('#result');

function AddField()
{
    let div = document.createElement('div');
    div.setAttribute('style', 'display: flex');

    let field = document.createElement('input');
    field.setAttribute('type', 'text');
    field.addEventListener('input', Calculate);

    let deleteBtn = document.createElement('button');
    deleteBtn.appendChild(document.createTextNode('usuń'));
    deleteBtn.addEventListener('click', e => 
    {
        container.removeChild(e.target.parentNode);
        Calculate();
    });

    div.appendChild(field);
    div.appendChild(deleteBtn);
    container.appendChild(div);
}

function Calculate()
{
    let sum = 0, count = 0, min = 0, max = 0, avg = 0;
    let first = true;

    container.querySelectorAll('input').forEach(input =>
        {
            let value = input.value.replace(",",".");
            let floatValue = parseFloat(value);

            if (floatValue)
            {
                sum += floatValue;
                count += 1;

                if (first)
                {
                    first = false;
                    max = floatValue;
                    min = floatValue;
                }
                else if (floatValue > max)
                {
                    max = floatValue;
                }
                else if (floatValue < min)
                {
                    min = floatValue;
                }
            }
        });

    if (count > 0)
        avg = sum / count;

    result.textContent = `Suma: ${sum}, Średnia: ${avg}, Min: ${min}, Max: ${max}`;
}

AddField();
AddField();
AddField();
Calculate();