import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { GitCompare, TrendingUp, BarChart3, Zap, Calendar, MapPin } from 'lucide-react';

interface ComparisonProfile {
  id: string;
  name: string;
  location: string;
  date: string;
  type: 'core' | 'bgc';
  data: {
    depth: number;
    temperature: number;
    salinity: number;
    oxygen?: number;
  }[];
  color: string;
}

export function ProfileComparison() {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(['profile1', 'profile2']);
  const [comparisonParameter, setComparisonParameter] = useState('temperature');
  const [showStatistics, setShowStatistics] = useState(true);
  const [comparisonType, setComparisonType] = useState('overlay');

  // Mock comparison profiles
  const availableProfiles: ComparisonProfile[] = [
    {
      id: 'profile1',
      name: 'Float 2902734 - Sep 14',
      location: '10.5°S, 80.2°E',
      date: '2024-09-14',
      type: 'core',
      color: '#ef4444',
      data: [
        { depth: 0, temperature: 28.5, salinity: 34.2 },
        { depth: 50, temperature: 26.8, salinity: 34.5 },
        { depth: 100, temperature: 22.1, salinity: 34.8 },
        { depth: 200, temperature: 18.3, salinity: 35.1 },
        { depth: 300, temperature: 15.2, salinity: 35.3 },
        { depth: 500, temperature: 12.8, salinity: 35.0 },
        { depth: 750, temperature: 9.4, salinity: 34.8 },
        { depth: 1000, temperature: 7.2, salinity: 34.7 },
        { depth: 1500, temperature: 4.8, salinity: 34.6 },
        { depth: 2000, temperature: 3.1, salinity: 34.7 }
      ]
    },
    {
      id: 'profile2',
      name: 'Float 2902851 - Sep 13',
      location: '8.3°S, 85.7°E',
      date: '2024-09-13',
      type: 'bgc',
      color: '#3b82f6',
      data: [
        { depth: 0, temperature: 29.1, salinity: 34.0, oxygen: 4.3 },
        { depth: 50, temperature: 27.2, salinity: 34.2, oxygen: 4.1 },
        { depth: 100, temperature: 23.5, salinity: 34.6, oxygen: 3.8 },
        { depth: 200, temperature: 19.1, salinity: 34.9, oxygen: 3.2 },
        { depth: 300, temperature: 16.0, salinity: 35.1, oxygen: 2.8 },
        { depth: 500, temperature: 13.2, salinity: 34.9, oxygen: 2.5 },
        { depth: 750, temperature: 10.1, salinity: 34.7, oxygen: 2.3 },
        { depth: 1000, temperature: 7.8, salinity: 34.6, oxygen: 2.1 },
        { depth: 1500, temperature: 5.2, salinity: 34.5, oxygen: 2.0 },
        { depth: 2000, temperature: 3.5, salinity: 34.6, oxygen: 1.9 }
      ]
    },
    {
      id: 'profile3',
      name: 'Float 2903156 - Sep 12',
      location: '15.2°S, 82.4°E',
      date: '2024-09-12',
      type: 'bgc',
      color: '#10b981',
      data: [
        { depth: 0, temperature: 26.2, salinity: 34.8, oxygen: 4.5 },
        { depth: 50, temperature: 24.8, salinity: 34.9, oxygen: 4.2 },
        { depth: 100, temperature: 21.3, salinity: 35.0, oxygen: 3.9 },
        { depth: 200, temperature: 17.8, salinity: 35.2, oxygen: 3.4 },
        { depth: 300, temperature: 14.9, salinity: 35.1, oxygen: 3.0 },
        { depth: 500, temperature: 12.1, salinity: 34.9, oxygen: 2.7 },
        { depth: 750, temperature: 8.9, salinity: 34.7, oxygen: 2.4 },
        { depth: 1000, temperature: 6.8, salinity: 34.6, oxygen: 2.2 },
        { depth: 1500, temperature: 4.2, salinity: 34.5, oxygen: 2.0 },
        { depth: 2000, temperature: 2.8, salinity: 34.6, oxygen: 1.8 }
      ]
    },
    {
      id: 'profile4',
      name: 'Float 2902734 - Aug 15',
      location: '10.8°S, 79.9°E',
      date: '2024-08-15',
      type: 'core',
      color: '#f59e0b',
      data: [
        { depth: 0, temperature: 27.8, salinity: 34.1 },
        { depth: 50, temperature: 26.2, salinity: 34.4 },
        { depth: 100, temperature: 21.8, salinity: 34.7 },
        { depth: 200, temperature: 17.9, salinity: 35.0 },
        { depth: 300, temperature: 14.8, salinity: 35.2 },
        { depth: 500, temperature: 12.3, salinity: 34.9 },
        { depth: 750, temperature: 9.1, salinity: 34.7 },
        { depth: 1000, temperature: 6.9, salinity: 34.6 },
        { depth: 1500, temperature: 4.5, salinity: 34.5 },
        { depth: 2000, temperature: 2.9, salinity: 34.6 }
      ]
    }
  ];

  const getSelectedProfilesData = () => {
    return availableProfiles.filter(profile => selectedProfiles.includes(profile.id));
  };

  const getCombinedData = () => {
    const selectedData = getSelectedProfilesData();
    if (selectedData.length === 0) return [];

    const depths = selectedData[0].data.map(d => d.depth);
    return depths.map(depth => {
      const point: any = { depth };
      selectedData.forEach(profile => {
        const dataPoint = profile.data.find(d => d.depth === depth);
        if (dataPoint) {
          point[`${profile.name}_temperature`] = dataPoint.temperature;
          point[`${profile.name}_salinity`] = dataPoint.salinity;
          point[`${profile.name}_oxygen`] = dataPoint.oxygen;
        }
      });
      return point;
    });
  };

  const calculateStatistics = () => {
    const selectedData = getSelectedProfilesData();
    if (selectedData.length < 2) return null;

    const stats = selectedData.map(profile => {
      const temps = profile.data.map(d => d.temperature);
      const salts = profile.data.map(d => d.salinity);
      
      return {
        name: profile.name,
        color: profile.color,
        tempRange: [Math.min(...temps), Math.max(...temps)],
        saltRange: [Math.min(...salts), Math.max(...salts)],
        avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
        avgSalt: salts.reduce((a, b) => a + b, 0) / salts.length,
        thermoclineDepth: profile.data.find(d => d.temperature < 20)?.depth || 'N/A'
      };
    });

    return stats;
  };

  const getParameterUnit = () => {
    switch (comparisonParameter) {
      case 'temperature': return '°C';
      case 'salinity': return 'PSU';
      case 'oxygen': return 'ml/L';
      default: return '';
    }
  };

  const handleProfileSelection = (profileId: string, checked: boolean) => {
    if (checked) {
      setSelectedProfiles(prev => [...prev, profileId]);
    } else {
      setSelectedProfiles(prev => prev.filter(id => id !== profileId));
    }
  };

  const combinedData = getCombinedData();
  const statistics = calculateStatistics();

  return (
    <div className="space-y-6">
      {/* Profile Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            <span>Profile Comparison</span>
          </CardTitle>
          <CardDescription>
            Compare multiple ARGO profiles to analyze oceanographic differences and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Profiles to Compare</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableProfiles.map(profile => (
                      <div key={profile.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={profile.id}
                          checked={selectedProfiles.includes(profile.id)}
                          onCheckedChange={(checked) => handleProfileSelection(profile.id, !!checked)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: profile.color }}
                            ></div>
                            <label htmlFor={profile.id} className="font-medium text-sm cursor-pointer">
                              {profile.name}
                            </label>
                            <Badge variant={profile.type === 'bgc' ? 'default' : 'secondary'} className="text-xs">
                              {profile.type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{profile.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{profile.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Comparison Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Parameter</label>
                    <Select value={comparisonParameter} onValueChange={setComparisonParameter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="salinity">Salinity</SelectItem>
                        <SelectItem value="oxygen">Dissolved Oxygen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comparison Type</label>
                    <Select value={comparisonType} onValueChange={setComparisonType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overlay">Overlay Profiles</SelectItem>
                        <SelectItem value="difference">Show Differences</SelectItem>
                        <SelectItem value="scatter">T-S Diagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="show-stats"
                      checked={showStatistics}
                      onCheckedChange={setShowStatistics}
                    />
                    <label htmlFor="show-stats" className="text-sm font-medium">
                      Show Statistics
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Export Chart
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    AI Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Visualization */}
      {selectedProfiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Comparison - {comparisonParameter.charAt(0).toUpperCase() + comparisonParameter.slice(1)}</CardTitle>
            <CardDescription>
              Comparing {selectedProfiles.length} profiles across depth
            </CardDescription>
          </CardHeader>
          <CardContent>
            {comparisonType === 'overlay' && (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={`${getSelectedProfilesData()[0]?.name}_${comparisonParameter}`}
                      type="number"
                      domain={['dataMin - 1', 'dataMax + 1']}
                      label={{ value: `${comparisonParameter.charAt(0).toUpperCase() + comparisonParameter.slice(1)} (${getParameterUnit()})`, position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      dataKey="depth" 
                      type="number"
                      reversed
                      domain={[0, 2000]}
                      label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    {getSelectedProfilesData().map(profile => (
                      <Line 
                        key={profile.id}
                        type="monotone" 
                        dataKey={`${profile.name}_${comparisonParameter}`}
                        stroke={profile.color}
                        strokeWidth={2}
                        name={profile.name}
                        dot={{ fill: profile.color, strokeWidth: 2, r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {comparisonType === 'scatter' && (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
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
                    <Tooltip />
                    <Legend />
                    {getSelectedProfilesData().map(profile => (
                      <Scatter 
                        key={profile.id}
                        name={profile.name}
                        data={profile.data.map(d => ({ temperature: d.temperature, salinity: d.salinity, depth: d.depth }))}
                        fill={profile.color}
                        stroke={profile.color}
                        strokeWidth={2}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {showStatistics && statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Statistics</CardTitle>
            <CardDescription>Statistical analysis of selected profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Profile</th>
                    <th className="text-left p-2">Temp Range (°C)</th>
                    <th className="text-left p-2">Salt Range (PSU)</th>
                    <th className="text-left p-2">Avg Temp (°C)</th>
                    <th className="text-left p-2">Avg Salt (PSU)</th>
                    <th className="text-left p-2">Thermocline (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: stat.color }}
                          ></div>
                          <span className="text-sm font-medium">{stat.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-sm">
                        {stat.tempRange[0].toFixed(1)} - {stat.tempRange[1].toFixed(1)}
                      </td>
                      <td className="p-2 text-sm">
                        {stat.saltRange[0].toFixed(1)} - {stat.saltRange[1].toFixed(1)}
                      </td>
                      <td className="p-2 text-sm">{stat.avgTemp.toFixed(1)}</td>
                      <td className="p-2 text-sm">{stat.avgSalt.toFixed(1)}</td>
                      <td className="p-2 text-sm">{stat.thermoclineDepth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}