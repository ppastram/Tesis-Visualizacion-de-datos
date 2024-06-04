import json
import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.graph_objs as go
from flask import Flask, render_template, request, jsonify
from flask import send_from_directory

# Initialize Flask application
app = Flask(__name__)

# Initialize Dash application
dash_app = dash.Dash(__name__, server=app, url_base_pathname='/dash/')

# Read data from CSV files
df = pd.read_csv('../data/data_depurada.csv')

votes = {"yes": 0, "no": 0}

# Define Dash layout
dash_app.layout = html.Div([
    dcc.Graph(id='graph'),
    html.Div([
        html.Label('X-Axis:'),
        dcc.Dropdown(
            id='x-axis-dropdown',
            options=[{'label': col, 'value': col} for col in df.columns],
            value=df.columns[0]
        ),
        html.Label('Y-Axis:'),
        dcc.Dropdown(
            id='y-axis-dropdown',
            options=[{'label': col, 'value': col} for col in df.columns],
            value=df.columns[1]
        )
    ])
])


@dash_app.callback(
    Output('graph', 'figure'),
    [Input('x-axis-dropdown', 'value'),
     Input('y-axis-dropdown', 'value'),
     Input('chart-type-dropdown', 'value')]
)
def update_graph(x_axis_column, y_axis_column, chart_type):
    # Filter dataframe based on selected columns
    grouped_data = df.groupby(x_axis_column)[y_axis_column].mean().reset_index()
    #------REVISAR SI VALORES ESTÁN BIEN AQUÍ

    # Print grouped_data in terminal
    print(grouped_data)

    if chart_type == 'barra':
        # Create Plotly trace for bar graph
        trace = go.Bar(
            x=grouped_data[x_axis_column],
            y=grouped_data[y_axis_column],
            name=y_axis_column
        )
    elif chart_type == 'torta':
        # Create Plotly trace for pie chart
        trace = go.Pie(
            labels=grouped_data[x_axis_column],
            values=grouped_data[y_axis_column]
        )

    # Create Plotly layout
    layout = go.Layout(
        title='Horas dedicadas a {} por {}'.format(y_axis_column, x_axis_column),
        xaxis=dict(title=x_axis_column),
        yaxis=dict(title=y_axis_column)
    )

    # Create Plotly figure
    fig = go.Figure(data=[trace], layout=layout)

    return fig


# Define Flask route to serve HTML template
@app.route('/')
def index():
    return render_template('index.html')


# Define Flask route to serve data as JSON
@app.route('/data')
def data():
    # Convert DataFrame to JSON
    data_json = df.to_json(orient='records')
    return data_json

@app.route('/visualizaciones/<path:path>')
def send_visualizaciones(path):
    return send_from_directory('../visualizaciones', path)


@app.route('/<path:path>')
def send_fuentes(path):
    return send_from_directory('.', path)


@app.route('/save-config', methods=['POST'])
def save_config():
    config = request.json
    # Save the config to a file or handle it as needed
    with open('config.json', 'w') as config_file:
        json.dump(config, config_file)
    return jsonify({"status": "success"}), 200

@app.route('/vote', methods=['POST'])
def vote():
    global votes
    data = request.json
    if data['vote'] == 'yes':
        votes['yes'] += 1
    elif data['vote'] == 'no':
        votes['no'] += 1
    return jsonify(votes)

@app.route('/results', methods=['GET'])
def results():
    return jsonify(votes)

# Run Flask application
if __name__ == '__main__':
    app.run(debug=True)