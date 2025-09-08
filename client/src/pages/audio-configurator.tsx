import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function AudioConfigurator() {
  const { toast } = useToast();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [configuration, setConfiguration] = useState({
    name: "",
    carBodyType: "",
    headUnitId: "",
    customHeadUnit: "",
    carPower: 12,
    frontSpeakers: {
      speakerId: "",
      customSpeaker: "",
      quantity: 2,
    },
    rearSpeakers: {
      speakerId: "",
      customSpeaker: "",
      quantity: 2,
    },
    amplifiers: [],
    subwoofers: {
      subwooferId: "",
      customSubwoofer: "",
      quantity: 1,
      boxType: "sealed",
    }
  });

  // Fetch available components
  const { data: headUnits = [] } = useQuery({
    queryKey: ["/api/audio/head-units"],
    queryFn: async () => {
      const response = await fetch("/api/audio/head-units?active=true");
      return response.json();
    }
  });

  const { data: speakers = [] } = useQuery({
    queryKey: ["/api/audio/speakers"],
    queryFn: async () => {
      const response = await fetch("/api/audio/speakers?active=true");
      return response.json();
    }
  });

  const { data: amplifiers = [] } = useQuery({
    queryKey: ["/api/audio/amplifiers"],
    queryFn: async () => {
      const response = await fetch("/api/audio/amplifiers?active=true");
      return response.json();
    }
  });

  const { data: subwoofers = [] } = useQuery({
    queryKey: ["/api/audio/subwoofers"],
    queryFn: async () => {
      const response = await fetch("/api/audio/subwoofers?active=true");
      return response.json();
    }
  });

  useEffect(() => {
    // Track pageview
    fetch("/api/stats/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview" }),
    }).catch(console.error);
  }, []);

  const calculateSystemCompatibility = () => {
    const issues = [];
    const recommendations = [];

    // Basic power calculations and compatibility checks
    let totalPowerRequirement = 0;
    
    // Add front speakers power requirement
    if (configuration.frontSpeakers.speakerId) {
      const speaker = speakers.find(s => s.id === configuration.frontSpeakers.speakerId);
      if (speaker) {
        totalPowerRequirement += speaker.powerRms * configuration.frontSpeakers.quantity;
      }
    }

    // Add rear speakers power requirement
    if (configuration.rearSpeakers.speakerId) {
      const speaker = speakers.find(s => s.id === configuration.rearSpeakers.speakerId);
      if (speaker) {
        totalPowerRequirement += speaker.powerRms * configuration.rearSpeakers.quantity;
      }
    }

    // Add subwoofer power requirement
    if (configuration.subwoofers.subwooferId) {
      const subwoofer = subwoofers.find(s => s.id === configuration.subwoofers.subwooferId);
      if (subwoofer) {
        totalPowerRequirement += subwoofer.powerRms * configuration.subwoofers.quantity;
      }
    }

    // Check head unit power output
    if (configuration.headUnitId) {
      const headUnit = headUnits.find(h => h.id === configuration.headUnitId);
      if (headUnit && headUnit.powerOutput < totalPowerRequirement) {
        issues.push(`Головное устройство выдает только ${headUnit.powerOutput}W, а система требует ${totalPowerRequirement}W`);
        recommendations.push("Рекомендуется добавить внешние усилители");
      }
    }

    // Check if car electrical system can handle the load
    const estimatedCurrentDraw = totalPowerRequirement / configuration.carPower;
    if (estimatedCurrentDraw > 30) {
      issues.push(`Система потребляет около ${estimatedCurrentDraw.toFixed(1)}A, что может быть много для стандартной проводки`);
      recommendations.push("Рекомендуется усиление проводки от аккумулятора");
    }

    // Car body type recommendations
    if (configuration.carBodyType === "coupe" && configuration.rearSpeakers.quantity > 0) {
      recommendations.push("В купе задние динамики могут быть менее эффективными из-за ограниченного пространства");
    }

    if (configuration.carBodyType === "sedan" && configuration.subwoofers.quantity > 1) {
      recommendations.push("В седане лучше использовать один качественный сабвуфер чем несколько маленьких");
    }

    return { issues, recommendations, totalPowerRequirement };
  };

  const handleSaveConfiguration = async () => {
    if (!configuration.name || !configuration.carBodyType) {
      toast({
        title: "Ошибка",
        description: "Заполните название конфигурации и тип кузова",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/audio/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...configuration,
          advancedMode,
        }),
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Конфигурация сохранена",
        });
        
        // Track calculation
        await fetch("/api/calculators/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "calculation" }),
        });
      } else {
        throw new Error("Failed to save configuration");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить конфигурацию",
        variant: "destructive",
      });
    }
  };

  const compatibility = calculateSystemCompatibility();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-card-foreground mb-4">
              Конфигуратор автозвука
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Создайте идеальную аудиосистему для вашего автомобиля. 
              Выберите компоненты и получите рекомендации по совместимости и установке.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Основные настройки</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="advanced-mode">Продвинутый режим</Label>
                      <Switch
                        id="advanced-mode"
                        checked={advancedMode}
                        onCheckedChange={setAdvancedMode}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="config-name">Название конфигурации</Label>
                    <Input
                      id="config-name"
                      value={configuration.name}
                      onChange={(e) => setConfiguration({...configuration, name: e.target.value})}
                      placeholder="Моя система автозвука"
                    />
                  </div>

                  <div>
                    <Label htmlFor="car-body">Тип кузова автомобиля</Label>
                    <Select value={configuration.carBodyType} onValueChange={(value) => setConfiguration({...configuration, carBodyType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип кузова" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Седан</SelectItem>
                        <SelectItem value="hatchback">Хэтчбек</SelectItem>
                        <SelectItem value="coupe">Купе</SelectItem>
                        <SelectItem value="suv">Внедорожник/SUV</SelectItem>
                        <SelectItem value="wagon">Универсал</SelectItem>
                        <SelectItem value="convertible">Кабриолет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="car-power">Напряжение в автомобиле (В)</Label>
                    <Select 
                      value={configuration.carPower.toString()} 
                      onValueChange={(value) => setConfiguration({...configuration, carPower: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12V (легковые автомобили)</SelectItem>
                        <SelectItem value="24">24V (грузовики)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Head Unit */}
              <Card>
                <CardHeader>
                  <CardTitle>Головное устройство</CardTitle>
                </CardHeader>
                <CardContent>
                  {advancedMode ? (
                    <div>
                      <Label htmlFor="custom-head-unit">Описание головного устройства</Label>
                      <Input
                        id="custom-head-unit"
                        value={configuration.customHeadUnit}
                        onChange={(e) => setConfiguration({...configuration, customHeadUnit: e.target.value})}
                        placeholder="Pioneer DEH-X7900BT, 4x50W, MP3/CD/USB/Bluetooth"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="head-unit">Выберите головное устройство</Label>
                      <Select value={configuration.headUnitId} onValueChange={(value) => setConfiguration({...configuration, headUnitId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите головное устройство" />
                        </SelectTrigger>
                        <SelectContent>
                          {headUnits.map((unit: any) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.brand} {unit.model} - {unit.powerOutput}W
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Speakers */}
              <Card>
                <CardHeader>
                  <CardTitle>Динамики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Передние динамики</h4>
                    {advancedMode ? (
                      <div className="space-y-3">
                        <div>
                          <Label>Описание передних динамиков</Label>
                          <Input
                            value={configuration.frontSpeakers.customSpeaker}
                            onChange={(e) => setConfiguration({
                              ...configuration,
                              frontSpeakers: {...configuration.frontSpeakers, customSpeaker: e.target.value}
                            })}
                            placeholder="Focal Access 165 AS, 165mm, 120W RMS, 4 Ом"
                          />
                        </div>
                        <div>
                          <Label>Количество передних динамиков</Label>
                          <Input
                            type="number"
                            min="0"
                            max="4"
                            value={configuration.frontSpeakers.quantity}
                            onChange={(e) => setConfiguration({
                              ...configuration,
                              frontSpeakers: {...configuration.frontSpeakers, quantity: parseInt(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Select 
                          value={configuration.frontSpeakers.speakerId} 
                          onValueChange={(value) => setConfiguration({
                            ...configuration,
                            frontSpeakers: {...configuration.frontSpeakers, speakerId: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите передние динамики" />
                          </SelectTrigger>
                          <SelectContent>
                            {speakers.map((speaker: any) => (
                              <SelectItem key={speaker.id} value={speaker.id}>
                                {speaker.brand} {speaker.model} - {speaker.size}mm, {speaker.powerRms}W RMS
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div>
                          <Label>Количество передних динамиков</Label>
                          <Select 
                            value={configuration.frontSpeakers.quantity.toString()}
                            onValueChange={(value) => setConfiguration({
                              ...configuration,
                              frontSpeakers: {...configuration.frontSpeakers, quantity: parseInt(value)}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Нет</SelectItem>
                              <SelectItem value="2">2 (стандарт)</SelectItem>
                              <SelectItem value="4">4 (компонентная система)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Задние динамики</h4>
                    {advancedMode ? (
                      <div className="space-y-3">
                        <div>
                          <Label>Описание задних динамиков</Label>
                          <Input
                            value={configuration.rearSpeakers.customSpeaker}
                            onChange={(e) => setConfiguration({
                              ...configuration,
                              rearSpeakers: {...configuration.rearSpeakers, customSpeaker: e.target.value}
                            })}
                            placeholder="Pioneer TS-G1720F, 165mm, 100W RMS, 4 Ом"
                          />
                        </div>
                        <div>
                          <Label>Количество задних динамиков</Label>
                          <Input
                            type="number"
                            min="0"
                            max="4"
                            value={configuration.rearSpeakers.quantity}
                            onChange={(e) => setConfiguration({
                              ...configuration,
                              rearSpeakers: {...configuration.rearSpeakers, quantity: parseInt(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Select 
                          value={configuration.rearSpeakers.speakerId} 
                          onValueChange={(value) => setConfiguration({
                            ...configuration,
                            rearSpeakers: {...configuration.rearSpeakers, speakerId: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите задние динамики" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Нет задних динамиков</SelectItem>
                            {speakers.map((speaker: any) => (
                              <SelectItem key={speaker.id} value={speaker.id}>
                                {speaker.brand} {speaker.model} - {speaker.size}mm, {speaker.powerRms}W RMS
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div>
                          <Label>Количество задних динамиков</Label>
                          <Select 
                            value={configuration.rearSpeakers.quantity.toString()}
                            onValueChange={(value) => setConfiguration({
                              ...configuration,
                              rearSpeakers: {...configuration.rearSpeakers, quantity: parseInt(value)}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Нет</SelectItem>
                              <SelectItem value="2">2 (стандарт)</SelectItem>
                              <SelectItem value="4">4 (компонентная система)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subwoofers */}
              <Card>
                <CardHeader>
                  <CardTitle>Сабвуферы</CardTitle>
                </CardHeader>
                <CardContent>
                  {advancedMode ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Описание сабвуфера</Label>
                        <Input
                          value={configuration.subwoofers.customSubwoofer}
                          onChange={(e) => setConfiguration({
                            ...configuration,
                            subwoofers: {...configuration.subwoofers, customSubwoofer: e.target.value}
                          })}
                          placeholder="JBL GTO1214, 12', 300W RMS, 4 Ом"
                        />
                      </div>
                      <div>
                        <Label>Количество сабвуферов</Label>
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={configuration.subwoofers.quantity}
                          onChange={(e) => setConfiguration({
                            ...configuration,
                            subwoofers: {...configuration.subwoofers, quantity: parseInt(e.target.value) || 0}
                          })}
                        />
                      </div>
                      <div>
                        <Label>Тип корпуса</Label>
                        <Input
                          value={configuration.subwoofers.boxType}
                          onChange={(e) => setConfiguration({
                            ...configuration,
                            subwoofers: {...configuration.subwoofers, boxType: e.target.value}
                          })}
                          placeholder="sealed, ported, bandpass"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Select 
                        value={configuration.subwoofers.subwooferId} 
                        onValueChange={(value) => setConfiguration({
                          ...configuration,
                          subwoofers: {...configuration.subwoofers, subwooferId: value}
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите сабвуфер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Нет сабвуфера</SelectItem>
                          {subwoofers.map((subwoofer: any) => (
                            <SelectItem key={subwoofer.id} value={subwoofer.id}>
                              {subwoofer.brand} {subwoofer.model} - {subwoofer.size}", {subwoofer.powerRms}W RMS
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div>
                        <Label>Количество сабвуферов</Label>
                        <Select 
                          value={configuration.subwoofers.quantity.toString()}
                          onValueChange={(value) => setConfiguration({
                            ...configuration,
                            subwoofers: {...configuration.subwoofers, quantity: parseInt(value)}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Нет</SelectItem>
                            <SelectItem value="1">1 сабвуфер</SelectItem>
                            <SelectItem value="2">2 сабвуфера</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Тип корпуса</Label>
                        <Select 
                          value={configuration.subwoofers.boxType}
                          onValueChange={(value) => setConfiguration({
                            ...configuration,
                            subwoofers: {...configuration.subwoofers, boxType: value}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sealed">Закрытый (sealed)</SelectItem>
                            <SelectItem value="ported">Фазоинверторный (ported)</SelectItem>
                            <SelectItem value="bandpass">Бандпасс (bandpass)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleSaveConfiguration} className="w-full gradient-glow">
                Сохранить конфигурацию
              </Button>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Анализ системы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Общая мощность RMS</div>
                      <div className="text-2xl font-bold text-primary">
                        {compatibility.totalPowerRequirement}W
                      </div>
                    </div>

                    {compatibility.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-destructive mb-2">Проблемы совместимости:</h4>
                        <div className="space-y-2">
                          {compatibility.issues.map((issue, index) => (
                            <Badge key={index} variant="destructive" className="block text-wrap">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {compatibility.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Рекомендации:</h4>
                        <div className="space-y-2">
                          {compatibility.recommendations.map((rec, index) => (
                            <Badge key={index} variant="secondary" className="block text-wrap">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {compatibility.issues.length === 0 && compatibility.recommendations.length === 0 && (
                      <Badge variant="default" className="bg-green-600">
                        Система совместима!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Информация</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Используйте базовый режим для быстрого выбора из библиотеки компонентов.
                  </p>
                  <p>
                    Продвинутый режим позволяет вручную вводить характеристики ваших компонентов.
                  </p>
                  <p>
                    Система автоматически проверяет совместимость и предлагает рекомендации для улучшения.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}