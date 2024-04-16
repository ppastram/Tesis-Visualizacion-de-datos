import dash
from dash import dcc
from dash import html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.graph_objs as go
from flask import Flask, render_template

# Initialize Flask application
app = Flask(__name__)

# Initialize Dash application
dash_app = dash.Dash(__name__, server=app, url_base_pathname='/dash/')

# Read data from CSV file
df = pd.read_csv('../data/data_depurada.csv')

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
     Input('y-axis-dropdown', 'value')]
)
def update_graph(x_axis_column, y_axis_column):
    # Filter dataframe based on selected columns
    grouped_data = df.groupby(x_axis_column)[y_axis_column].mean().reset_index()

    # Create Plotly trace
    trace = go.Bar(
        x=grouped_data[x_axis_column],
        y=grouped_data[y_axis_column],
        name=y_axis_column
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


# Run Flask application
if __name__ == '__main__':
    app.run(debug=True)