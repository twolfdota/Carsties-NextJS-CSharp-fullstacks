using System;
using System.Security.Claims;

namespace AuctionService.UnitTests.Utils;

public class Helpers
{
    public static ClaimsPrincipal GetClaimsPrincipal()
    {
        var claim = new List<Claim> { new Claim(ClaimTypes.Name, "test") };
        var identity = new ClaimsIdentity(claim, "testing");
        return new ClaimsPrincipal(identity);
    }
}
