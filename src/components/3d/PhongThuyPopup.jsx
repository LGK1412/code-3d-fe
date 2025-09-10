"use client";

export default function PhongThuyPopup({ menh, huong_bad = [], huong_good = [], name }) {
    console.log(menh);
    
    return (
        <div style={{
            position: 'absolute',
            top: '5%',
            right: '17%',
            transform: 'translateX(-50%)',
            width: 300,
            padding: 16,
            borderRadius: 10,
            background: 'rgba(48, 48, 48, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            zIndex: 999,
            fontFamily: 'sans-serif',
            color: 'white',
            maxHeight: 200,
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line'
        }}>
            <h3 style={{ margin: 0, fontSize: 18, marginBottom: 4 }}>
                Phong thủy: {name}
            </h3>
            <p style={{ margin: 0, fontSize: 14 }}>
                Mệnh: <strong>{menh}</strong>
            </p>

            {huong_good?.length > 0 && (
                <p style={{ fontSize: 14, marginTop: 8 }}>
                    ✔️ <strong>Nên đặt hướng:</strong> {huong_good.join(', ')}
                </p>
            )}

            {huong_bad?.length > 0 && (
                <p style={{ fontSize: 14, marginTop: 8 }}>
                    ❌ <strong>Không nên đặt hướng:</strong> {huong_bad.join(', ')}
                </p>
            )}
        </div>
    );
}
