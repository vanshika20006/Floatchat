import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Thermometer, Droplets, Activity, Calendar } from 'lucide-react';

export function DataVisualization() {
  const [selectedFloat, setSelectedFloat] = useState('2902734');
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock profile data
  const temperatureProfile = [
    { depth: 0, value: 28.5, month: 'Sep' },
    { depth: 50, value: 26.8, month: 'Sep' },
    { depth: 100, value: 22.1, month: 'Sep' },
    { depth: 200, value: 18.3, month: 'Sep' },
    { depth: 300, value: 15.2, month: 'Sep' },
    { depth: 500, value: 12.8, month: 'Sep' },
    { depth: 750, value: 9.4, month: 'Sep' },
    { depth: 1000, value: 7.2, month: 'Sep' },
    { depth: 1500, value: 4.8, month: 'Sep' },
    { depth: 2000, value: 3.1, month: 'Sep' }
  ];

  const salinityProfile = [
    { depth: 0, value: 34.2, month: 'Sep' },
    { depth: 50, value: 34.5, month: 'Sep' },
    { depth: 100, value: 34.8, month: 'Sep' },
    { depth: 200, value: 35.1, month: 'Sep' },
    { depth: 300, value: 35.3, month: 'Sep' },
    { depth: 500, value: 35.0, month: 'Sep' },
    { depth: 750, value: 34.8, month: 'Sep' },
    { depth: 1000, value: 34.7, month: 'Sep' },
    { depth: 1500, value: 34.6, month: 'Sep' },
    { depth: 2000, value: 34.7, month: 'Sep' }
  ];

  const timeSeriesData = [
    { date: '2024-08-15', temperature: 28.2, salinity: 34.1, oxygen: 4.2 },
    { date: '2024-08-25', temperature: 28.8, salinity: 34.0, oxygen: 4.3 },
    { date: '2024-09-01', temperature: 29.1, salinity: 33.9, oxygen: 4.1 },
    { date: '2024-09-05', temperature: 28.9, salinity: 34.2, oxygen: 4.4 },
    { date: '2024-09-10', temperature: 28.5, salinity: 34.2, oxygen: 4.2 },
    { date: '2024-09-15', temperature: 28.5, salinity: 34.2, oxygen: 4.3 }
  ];

  const bgcData = [
    { parameter: 'Chlorophyll-a', value: 0.15, unit: 'mg/m³', status: 'normal' },
    { parameter: 'Dissolved O₂', value: 4.2, unit: 'ml/L', status: 'normal' },
    { parameter: 'Nitrate', value: 12.8, unit: 'μmol/kg', status: 'elevated' },
    { parameter: 'pH', value: 8.1, unit: '', status: 'normal' },
    { parameter: 'Backscatter', value: 0.0021, unit: 'm⁻¹', status: 'low' },
    { parameter: 'CDOM', value: 0.31, unit: 'ppb', status: 'normal' }
  ];

  const getCurrentData = () => {
    return selectedParameter === 'temperature' ? temperatureProfile : salinityProfile;
  };

  const getParameterUnit = () => {
    return selectedParameter === 'temperature' ? '°C' : 'PSU';
  };

  const getParameterColor = () => {
    return selectedParameter === 'temperature' ? '#ef4444' : '#3b82f6';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Data Visualization Controls</span>
          </CardTitle>
          <CardDescription>
            Configure parameters and time ranges for oceanographic data analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Float ID</label>
              <Select value={selectedFloat} onValueChange={setSelectedFloat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2902734">2902734 (Core)</SelectItem>
                  <SelectItem value="2902851">2902851 (BGC)</SelectItem>
                  <SelectItem value="2903156">2903156 (BGC)</SelectItem>
                  <SelectItem value="2903287">2903287 (BGC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parameter</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="salinity">Salinity</SelectItem>
                  <SelectItem value="pressure">Pressure</SelectItem>
                  <SelectItem value="oxygen">Dissolved Oxygen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                Update Visualization
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Tabs */}
      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profiles">Depth Profiles</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
          <TabsTrigger value="scatter">Scatter Plots</TabsTrigger>
          <TabsTrigger value="bgc">BGC Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span>Temperature Profile</span>
                </CardTitle>
                <CardDescription>Vertical temperature distribution (Float {selectedFloat})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureProfile}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="value" 
                        type="number"
                        domain={['dataMin - 1', 'dataMax + 1']}
                        label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="depth" 
                        type="number"
                        reversed
                        domain={[0, 2000]}
                        label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}°C`, 'Temperature']}
                        labelFormatter={(value) => `Depth: ${value}m`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>Salinity Profile</span>
                </CardTitle>
                <CardDescription>Vertical salinity distribution (Float {selectedFloat})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salinityProfile}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="value" 
                        type="number"
                        domain={['dataMin - 0.1', 'dataMax + 0.1']}
                        label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="depth" 
                        type="number"
                        reversed
                        domain={[0, 2000]}
                        label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value} PSU`, 'Salinity']}
                        labelFormatter={(value) => `Depth: ${value}m`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeseries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>Surface Parameters Time Series</span>
              </CardTitle>
              <CardDescription>Temporal evolution of surface oceanographic parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="temp-sal"
                      label={{ value: 'Temperature (°C) / Salinity (PSU)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="oxygen"
                      orientation="right"
                      label={{ value: 'Oxygen (ml/L)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="temp-sal"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line 
                      yAxisId="temp-sal"
                      type="monotone" 
                      dataKey="salinity" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Salinity (PSU)"
                    />
                    <Line 
                      yAxisId="oxygen"
                      type="monotone" 
                      dataKey="oxygen" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Oxygen (ml/L)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scatter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temperature vs Salinity (T-S Diagram)</CardTitle>
              <CardDescription>Water mass analysis for Float {selectedFloat}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={temperatureProfile.map((t, i) => ({
                    temperature: t.value,
                    salinity: salinityProfile[i]?.value || 0,
                    depth: t.depth
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="salinity" 
                      type="number"
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                      label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="temperature" 
                      type="number"
                      domain={['dataMin - 1', 'dataMax + 1']}
                      label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'temperature' ? `${value}°C` : `${value} PSU`,
                        name === 'temperature' ? 'Temperature' : 'Salinity'
                      ]}
                      labelFormatter={(value, payload) => 
                        payload && payload[0] ? `Depth: ${payload[0].payload.depth}m` : ''
                      }
                    />
                    <Scatter 
                      dataKey="temperature" 
                      fill="#8884d8"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bgc" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bgcData.map((param, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{param.parameter}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">
                      {param.value} <span className="text-sm font-normal text-gray-500">{param.unit}</span>
                    </div>
                    <Badge 
                      variant={
                        param.status === 'normal' ? 'default' : 
                        param.status === 'elevated' ? 'destructive' : 'secondary'
                      }
                    >
                      {param.status}
                    </Badge>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          param.status === 'normal' ? 'bg-green-500' : 
                          param.status === 'elevated' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ 
                          width: param.status === 'normal' ? '75%' : 
                                 param.status === 'elevated' ? '90%' : '45%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>BGC Parameter Trends</CardTitle>
              <CardDescription>Recent trends in biogeochemical parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bgcData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="parameter" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}