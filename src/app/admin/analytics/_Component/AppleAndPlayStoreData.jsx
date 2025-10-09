"use client";
import React, { useState } from "react";
import { Card, Row, Col } from "antd";
import CountUp from "react-countup";
import { ReviewsComponent } from "./ReviewsModal";

export default function AppAnalyticsComponent() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <Image
                  width={24}
                  height={24}
                  src="https://via.placeholder.com/24"
                  alt="Apple App Store"
                  style={{ marginRight: "10px" }}
                /> */}
                Apple App Store
              </div>
            }
            extra={
              <p onClick={() => setOpen(true)} className="cursor-pointer">
                View latest reviews
              </p>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                Installs:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={1240} />
                </span>
              </Col>
              <Col span={6}>
                Uninstalls:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={343} />
                </span>
              </Col>
              <Col span={6}>
                Avg Rating: <span className="text-2xl font-bold"> 4.7</span>
              </Col>
              <Col span={6}>
                Reviews:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={2.1} />K
                </span>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <Image
                  width={24}
                  height={24}
                  src="https://via.placeholder.com/24"
                  alt="Google Play"
                  style={{ marginRight: "10px" }}
                /> */}
                Google Play
              </div>
            }
            extra={
              <p onClick={() => setOpen(true)} className="cursor-pointer">
                {" "}
                View latest reviews
              </p>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                Installs:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={1240} />
                </span>
              </Col>
              <Col span={6}>
                Uninstalls:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={343} />
                </span>
              </Col>
              <Col span={6}>
                Avg Rating: <span className="text-2xl font-bold"> 4.7</span>
              </Col>
              <Col span={6}>
                Reviews:{" "}
                <span className="text-2xl font-bold">
                  <CountUp end={2.1} />K
                </span>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Card
        title="Conversion Funnel"
        style={{ marginTop: "20px" }}
        bodyStyle={{ padding: "20px" }}
      >
        <p>User journey from app open to purchase</p>
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col span={6}>
            <Card
              style={{
                textAlign: "center",
                background: "#e6f7ff",
                borderRadius: "8px",
              }}
            >
              <p>App Opens</p>
              <h3>1,000</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                textAlign: "center",
                background: "#e6f7ff",
                borderRadius: "8px",
              }}
            >
              <p>Coupon Views</p>
              <h3>600</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                textAlign: "center",
                background: "#e6f7ff",
                borderRadius: "8px",
              }}
            >
              <p>Code Copies</p>
              <h3>250</h3>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              style={{
                textAlign: "center",
                background: "#e6f7ff",
                borderRadius: "8px",
              }}
            >
              <p>Purchases</p>
              <h3>40</h3>
            </Card>
          </Col>
        </Row>
      </Card>

      <ReviewsComponent open={open} setOpen={setOpen} />
    </div>
  );
}
